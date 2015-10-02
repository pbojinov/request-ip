/**
 * Author: petar bojinov - @pbojinov
 * Date: 04/03/15
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
    var ipAddress = null;

    // workaround to get real client IP
    // most likely because our app will be behind a [reverse] proxy or load balancer
    var clientIp = req.headers['x-client-ip'],
        forwardedForAlt = req.headers['x-forwarded-for'],
        realIp = req.headers['x-real-ip'],
        // more obsure ones below
        clusterClientIp = req.headers['x-cluster-client-ip'],
        forwardedAlt = req.headers['x-forwarded'],
        forwardedFor = req.headers['forwarded-for'],
        forwarded = req.headers['forwarded'],
        
        // remote address check
        reqConRA = req.connection ? req.connection.remoteAddress
                                  : null,
        reqSockRA = req.socket ? req.socket.remoteAddress
                               : null,
        reqConSockRA = (req.connection && req.connection.socket) ? req.connection.socket.remoteAddress
                                                                 : null,
        reqInfoRA = req.info ? req.info.remoteAddress
                                : null;

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

    // remote address
    else if (reqConRA) {
        ipAddress = reqConRA;
    }
    else if (reqSockRA) {
        ipAddress = reqSockRA
    }
    else if (reqConSockRA) {
        ipAddress = reqConSockRA
    }
    else if (reqInfoRA) {
        ipAddress = reqInfoRA
    }
    
    return ipAddress;
}

/**
 * Expose mode public functions
 */
exports.getClientIp = getClientIp;
