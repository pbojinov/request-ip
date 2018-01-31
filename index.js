const is = require('is_js');

/**
 * Parse x-forwarded-for headers.
 *
 * @param {string} value - The value to be parsed.
 * @return {string|null} First known IP address, if any.
 */
function getClientIpFromXForwardedFor(value) {
    if (!is.existy(value)) {
        return null;
    }

    if (is.not.string(value)) {
        throw new TypeError('Expected a string, got "' + typeof value + '"');
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
 * Determine client IP address.
 *
 * @param req
 * @returns {string} ip - The IP address if known, defaulting to empty string if unknown.
 */
function getClientIp(req) {
    // Server is probably behind a proxy.
    if (req.headers) {
        // Standard headers used by Amazon EC2, Heroku, and others.
        if (is.ip(req.headers['x-client-ip'])) {
            return req.headers['x-client-ip'];
        }

        // Load-balancers (AWS ELB) or proxies.
        const xForwardedFor = getClientIpFromXForwardedFor(req.headers['x-forwarded-for']);
        if (is.ip(xForwardedFor)) {
            return xForwardedFor;
        }

        // Cloudflare.
        // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
        // CF-Connecting-IP - applied to every request to the origin.
        if (is.ip(req.headers['cf-connecting-ip'])) {
            return req.headers['cf-connecting-ip'];
        }

        // Akamai and Cloudflare: True-Client-IP.
        if (is.ip(req.headers['true-client-ip'])) {
            return req.headers['true-client-ip'];
        }

        // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
        if (is.ip(req.headers['x-real-ip'])) {
            return req.headers['x-real-ip'];
        }

        // (Rackspace LB and Riverbed's Stingray)
        // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
        // https://splash.riverbed.com/docs/DOC-1926
        if (is.ip(req.headers['x-cluster-client-ip'])) {
            return req.headers['x-cluster-client-ip'];
        }

        if (is.ip(req.headers['x-forwarded'])) {
            return req.headers['x-forwarded'];
        }

        if (is.ip(req.headers['forwarded-for'])) {
            return req.headers['forwarded-for'];
        }

        if (is.ip(req.headers.forwarded)) {
            return req.headers.forwarded;
        }
    }

    // Remote address checks.
    if (is.existy(req.connection)) {
        if (is.ip(req.connection.remoteAddress)) {
            return req.connection.remoteAddress;
        }
        if (is.existy(req.connection.socket) && is.ip(req.connection.socket.remoteAddress)) {
            return req.connection.socket.remoteAddress;
        }
    }

    if (is.existy(req.socket) && is.ip(req.socket.remoteAddress)) {
        return req.socket.remoteAddress;
    }

    if (is.existy(req.info) && is.ip(req.info.remoteAddress)) {
        return req.info.remoteAddress;
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
        req[attributeName] = getClientIp(req); // eslint-disable-line no-param-reassign
        next();
    };
}

module.exports = {
    getClientIpFromXForwardedFor,
    getClientIp,
    mw,
};
