/**
 * Author: petar bojinov - @pbojinov
 * Date: 01/27/16
 */

'use strict';

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
    var clientIp = req.headers['x-client-ip'];
    var forwardedForAlt = req.headers['x-forwarded-for'];
    var realIp = req.headers['x-real-ip'];
    
    // more obsure ones below
    var clusterClientIp = req.headers['x-cluster-client-ip'];
    var forwardedAlt = req.headers['x-forwarded'];
    var forwardedFor = req.headers['forwarded-for'];
    var forwarded = req.headers['forwarded'];
        
    // remote address check
    var reqConnectionRemoteAddress = req.connection ? req.connection.remoteAddress : null;
    var reqSocketRemoteAddress = req.socket ? req.socket.remoteAddress : null;
    var reqConnectionSocketRemoteAddress = (req.connection && req.connection.socket) ? req.connection.socket.remoteAddress : null;
    var reqInfoRemoteAddress = req.info ? req.info.remoteAddress : null;

    // x-client-ip
    if (clientIp) {
        ipAddress = clientIp;
    }

    // x-forwarded-for
    else if (forwardedForAlt) {
        // x-forwarded-for header is more common
        // it may return multiple IP addresses in the format: 
        // "client IP, proxy 1 IP, proxy 2 IP" 
        // we pick the first one
        var forwardedIps = forwardedForAlt.split(',');
        ipAddress = forwardedIps[0];
    }

    // x-real-ip 
    // (default nginx proxy/fcgi)
    else if (realIp) {
        // alternative to x-forwarded-for
        // used by some proxies
        ipAddress = realIp;
    }

    // x-cluster-client-ip 
    // (Rackspace LB and Riverbed's Stingray)
    // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
    // https://splash.riverbed.com/docs/DOC-1926
    else if (clusterClientIp) {
        ipAddress = clusterClientIp;
    }

    // x-forwarded
    else if (forwardedAlt) {
        ipAddress = forwardedAlt;
    }

    // forwarded-for
    else if (forwardedFor) {
        ipAddress = forwardedFor;
    }

    // forwarded
    else if (forwarded) {
        ipAddress = forwarded;
    }

    // remote address checks
    else if (reqConnectionRemoteAddress) {
        ipAddress = reqConnectionRemoteAddress;
    }
    else if (reqSocketRemoteAddress) {
        ipAddress = reqSocketRemoteAddress
    }
    else if (reqConnectionSocketRemoteAddress) {
        ipAddress = reqConnectionSocketRemoteAddress
    }
    else if (reqInfoRemoteAddress) {
        ipAddress = reqInfoRemoteAddress
    } 

    // return null if we cannot find an address
    else {
        ipAddress = null;
    }
    
    return ipAddress;
}

/**
 * Expose mode public functions
 */
exports.getClientIp = getClientIp;


/**
 * Expose a default implemtation for a connect middleware
 * 
 * @options.attributeName - name of attribute to augment request object with
 */
exports.mw = function(options) {
    if (!options) options = {};
    var attr = options.attributeName || "clientIp";
    return function(req, res, next) {
        req[attr] = getClientIp(req);
        next();
    }
};
