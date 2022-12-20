const is = require('./is');

const defaultHeaderPrioritylist = [
    'x-client-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'fastly-client-ip',
    'true-client-ip',
    'x-real-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded',
    'x-appengine-user-ip',
];

let headerPriorityList = defaultHeaderPrioritylist;

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
        throw new TypeError(`Expected a string, got "${typeof value}"`);
    }

    // x-forwarded-for may return multiple IP addresses in the format:
    // "client IP, proxy 1 IP, proxy 2 IP"
    // Therefore, the right-most IP address is the IP address of the most recent proxy
    // and the left-most IP address is the IP address of the originating client.
    // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
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
    // Therefore taking the right-most IP address that is not unknown
    // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
    for (let i = 0; i < forwardedIps.length; i++) {
        if (is.ip(forwardedIps[i])) {
            return forwardedIps[i];
        }
    }

    // If no value in the split list is an ip, return null
    return null;
}

/**
 * @param req
 * @param {string} header - header name
 * @returns {string | undefined | null}
 */
function getClientIpByHeader(req, header) {
    if (!req?.headers?.[header]) return null;

    switch (header) {
        // Standard headers used by Amazon EC2, Heroku, and others.
        case 'x-client-ip': {
            if (is.ip(req.headers['x-client-ip'])) {
                return req.headers['x-client-ip'];
            }
            break;
        }
        // Load-balancers (AWS ELB) or proxies.
        case 'x-forwarded-for': {
            const xForwardedFor = getClientIpFromXForwardedFor(
                req.headers['x-forwarded-for'],
            );

            if (is.ip(xForwardedFor)) {
                return xForwardedFor;
            }
            break;
        }
        // Cloudflare.
        // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
        // CF-Connecting-IP - applied to every request to the origin.
        case 'cf-connecting-ip': {
            if (is.ip(req.headers['cf-connecting-ip'])) {
                return req.headers['cf-connecting-ip'];
            }
            break;
        }
        // Fastly and Firebase hosting header (When forwared to cloud function)
        case 'fastly-client-ip': {
            if (is.ip(req.headers['fastly-client-ip'])) {
                return req.headers['fastly-client-ip'];
            }
            break;
        }
        // Akamai and Cloudflare: True-Client-IP.
        case 'true-client-ip': {
            if (is.ip(req.headers['true-client-ip'])) {
                return req.headers['true-client-ip'];
            }
            break;
        }
        // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
        case 'x-real-ip': {
            if (is.ip(req.headers['x-real-ip'])) {
                return req.headers['x-real-ip'];
            }
            break;
        }
        // (Rackspace LB and Riverbed's Stingray)
        // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
        // https://splash.riverbed.com/docs/DOC-1926
        case 'x-cluster-client-ip': {
            if (is.ip(req.headers['x-cluster-client-ip'])) {
                return req.headers['x-cluster-client-ip'];
            }
            break;
        }
        case 'x-forwarded': {
            if (is.ip(req.headers['x-forwarded'])) {
                return req.headers['x-forwarded'];
            }
            break;
        }
        case 'forwarded-for': {
            if (is.ip(req.headers['forwarded-for'])) {
                return req.headers['forwarded-for'];
            }
            break;
        }
        case 'forwarded': {
            if (is.ip(req.headers['forwarded'])) {
                return req.headers['forwarded'];
            }
            break;
        }

        // Google Cloud App Engine
        // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers
        case 'x-appengine-user-ip': {
            if (is.ip(req.headers['x-appengine-user-ip'])) {
                return req.headers['x-appengine-user-ip'];
            }
            break;
        }
        default: {
        }
    }

    return null;
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
        for (const header of headerPriorityList) {
            const value = getClientIpByHeader(req, header);
            if (value) return value;
        }
    }

    // Remote address checks.
    // Deprecated
    if (is.existy(req.connection)) {
        if (is.ip(req.connection.remoteAddress)) {
            return req.connection.remoteAddress;
        }
        if (
            is.existy(req.connection.socket) &&
            is.ip(req.connection.socket.remoteAddress)
        ) {
            return req.connection.socket.remoteAddress;
        }
    }

    if (is.existy(req.socket) && is.ip(req.socket.remoteAddress)) {
        return req.socket.remoteAddress;
    }

    if (is.existy(req.info) && is.ip(req.info.remoteAddress)) {
        return req.info.remoteAddress;
    }

    // AWS Api Gateway + Lambda
    if (
        is.existy(req.requestContext) &&
        is.existy(req.requestContext.identity) &&
        is.ip(req.requestContext.identity.sourceIp)
    ) {
        return req.requestContext.identity.sourceIp;
    }

    // Cloudflare fallback
    // https://blog.cloudflare.com/eliminating-the-last-reasons-to-not-enable-ipv6/#introducingpseudoipv4
    if (req.headers) {
        if (is.ip(req.headers['Cf-Pseudo-IPv4'])) {
            return req.headers['Cf-Pseudo-IPv4'];
        }
    }

    // Fastify https://www.fastify.io/docs/latest/Reference/Request/
    if (is.existy(req.raw)) {
        return getClientIp(req.raw);
    }

    return null;
}

/**
 * Expose request IP as a middleware.
 *
 * @param {object}    [options] - Configuration.
 * @param {string}    [options.attributeName] - Name of attribute to augment request object with.
 * @param {string[]}  [options.prioritize] - Array of string of prioritized headers to be checked first
 * @return {*}
 */
function mw(options) {
    // Defaults.
    const configuration = is.not.existy(options) ? {} : options;

    // Validation.
    if (is.not.object(configuration)) {
        throw new TypeError('Options must be an object!');
    }

    if (configuration?.prioritize?.length) {
        if (
            configuration?.prioritize.find((item) => typeof item !== 'string')
        ) {
            throw new TypeError('Prioritize list must be an array of string!');
        }

        for (const prioritizedHeader of configuration.prioritize) {
            for (let i = 0; i < headerPriorityList.length; i++) {
                if (prioritizedHeader === headerPriorityList[i]) {
                    headerPriorityList.splice(i, 1);
                    break;
                }
            }
        }

        headerPriorityList.unshift(...configuration.prioritize);
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
    getClientIpByHeader,
    getClientIp,
    mw,
};
