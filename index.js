/**
 * Author: petar bojinov - @pbojinov
 * Date: 01/16/15
 */

/**
 * Get client IP address
 *
 * Will return 127.0.0.1 when testing locally
 * Useful when you need the user ip for geolocation or serving localized content
 *
 * @method getClientIp
 * @param req
 * @returns {string} ip
 */
function getClientIp(req) {

    // the ipAddress we return
    var ipAddress;

    // workaround to get real client IP
    // most likely because our app will be behind a [reverse] proxy or load balancer
    var clientIp = req.headers['x-client-ip'],
        forwardedIpsStr = req.headers['x-forwarded-for'],
        altForwardedIp = req.headers['x-real-ip'];

    // x-client-ip
    if (clientIp) {
        ipAddress = clientIp;
    }

    // x-forwarded-for
    else if (forwardedIpsStr) {
        // x-forwarded-for header is more common
        // it may return multiple IP addresses in the format: 
        // "client IP, proxy 1 IP, proxy 2 IP" 
        // we pick the first one
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }

    // x-real-ip
    else if (altForwardedIp) {
        // alternative to x-forwarded-for
        // used by some proxies
        ipAddress = altForwardedIp;
    }

    // fallback to something
    if (!ipAddress) {
        // ensure getting client IP address still works in development environment
        ipAddress = req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    }

    return ipAddress;
}

/**
 * Expose mode public functions
 */
exports.getClientIp = getClientIp;
