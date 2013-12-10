/**
 * Author: petar bojinov - @pbojinov
 * Date: 9/29/13
 */

/**
 * @method getClientIp
 *
 * Get client IP address
 * 
 * Will return 127.0.0.1 when testing locally
 * Useful when you need the user ip for geolocation or serving localized content
 *
 * @param req
 * @returns {string} ip
 */
function getClientIp(req) {
    var ipAddress;
    // Amazon EC2 / Heroku workaround to get real client IP
    var forwardedIpsStr = req.header('X-Forwarded-For'),
        clientIp = req.header('X-Client-IP');

    if (clientIp) {
        ipAddress = clientIp;
    }
    else if (forwardedIpsStr) {
        // 'x-forwarded-for' header may return multiple IP addresses in
        // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
        // the first one
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        // Ensure getting client IP address still works in
        // development environment
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

/**
* Expose mode public functions
*/
exports.getClientIp = getClientIp;