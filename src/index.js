const is = require('is_js');
const extend = require('extend');

const DEFAULTS = {
    sources: [
        // Standard headers used by Amazon EC2, Heroku, and others.
        'headers.x-client-ip',
        // Load-balancers (AWS ELB) or proxies.
        'headers.x-forwarded-for',
        // Cloudflare.
        // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
        // CF-Connecting-IP - applied to every request to the origin.
        'headers.cf-connecting-ip',
        // Fastly and Firebase hosting header (When forwared to cloud function)
        'headers.fastly-client-ip',
        // Akamai and Cloudflare: True-Client-IP.
        'headers.true-client-ip',
        // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
        'headers.x-real-ip',
        // (Rackspace LB and Riverbed's Stingray)
        // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
        // https://splash.riverbed.com/docs/DOC-1926
        'headers.x-cluster-client-ip',
        'headers.x-forwarded',
        'headers.forwarded-for',
        'headers.forwarded',
        'connection.remoteAddress',
        'connection.socket.remoteAddress',
        'socket.remoteAddress',
        'info.remoteAddress',
        // AWS Api Gateway + Lambda
        'requestContext.identity.sourceIp',
    ],
};

/**
 * Parse x-forwarded-for headers.
 *
 * @param {string} value - The value to be parsed.
 * @return {string|null} First known IP address, if any.
 */
function getClientIpFromXForwardedFor(value) {
    if (is.not.string(value)) {
        throw new TypeError(`Expected a string, got "${typeof value}"`);
    }

    // x-forwarded-for may return multiple IP addresses in the format:
    // "client IP, proxy 1 IP, proxy 2 IP"
    // Therefore, the right-most IP address is the IP address of the most recent proxy
    // and the left-most IP address is the IP address of the originating client.
    // source: http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html
    // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
    const forwardedIps = value.split(',').map((e) => {
        const ip = e.trim();
        if (ip.includes(':')) {
            const splitted = ip.split(':');
            // make sure we only use this if it's ipv4 (ip:port)
            if (splitted.length === 2) {
                return splitted[0];
            }
        }
        return ip;
    });

    // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
    // Therefore taking the left-most IP address that is not unknown
    // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
    return forwardedIps.find(is.ip);
}

/**
 * Parse object tree and fetch relevant key.
 *
 * @param req
 * @param keys
 * @returns {string|null|*} - The value from the object tree.
 */
function getIpFromSource(req, keys) {
    const key = keys.shift();
    if (!is.existy(req[key])) {
        return null;
    }
    if (keys.length !== 0) {
        return getIpFromSource(req[key], keys);
    }
    if (key === 'x-forwarded-for') {
        return getClientIpFromXForwardedFor(req[key]);
    }
    return req[key];
}

/**
 * Determine client IP address.
 *
 * @param req
 * @param _options
 * @returns {string} ip - The IP address if known, defaulting to empty string if unknown.
 */
function getClientIp(req, _options = {}) {
    const options = extend(false, {}, DEFAULTS, _options);
    const { sources } = options;

    // eslint-disable-next-line no-restricted-syntax
    for (const key in sources) {
        // eslint-disable-next-line no-prototype-builtins
        if (Object.prototype.hasOwnProperty(sources, key)) {
            // eslint-disable-next-line no-continue
            continue;
        }
        const source = sources[key];
        const keys = source.split('.');
        const ip = getIpFromSource(req, keys);
        if (is.ip(ip)) {
            return ip;
        }
    }

    return null;
}

/**
 * Expose request IP as a middleware.
 *
 * @param {object} [options] - Configuration.
 * @param {string} [options.attributeName] - Name of attribute to augment request object with.
 * @return {*}
 */
function mw(options) {
    // Defaults.
    const configuration = is.not.existy(options) ? {} : options;

    // Validation.
    if (is.not.object(configuration)) {
        throw new TypeError('Options must be an object!');
    }

    const attributeName = configuration.attributeName || 'clientIp';
    return (req, res, next) => {
        const ip = getClientIp(req);
        Object.defineProperty(req, attributeName, {
            get: () => ip,
            configurable: true,
        });
        next();
    };
}

module.exports = {
    getClientIpFromXForwardedFor,
    getClientIp,
    mw,
};
