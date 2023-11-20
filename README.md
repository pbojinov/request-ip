# request-ip

A tiny Node.js module for retrieving a request's IP address, for informational purposes only (not to be relied on for security).

![](https://nodei.co/npm/request-ip.png?downloads=true&cacheBust=3)

[![CI](https://github.com/pbojinov/request-ip/actions/workflows/ci.yml/badge.svg)](https://github.com/pbojinov/request-ip/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/pbojinov/request-ip/badge.svg)](https://coveralls.io/r/pbojinov/request-ip)
![](https://img.shields.io/npm/l/express.svg)
[![npm version](https://badge.fury.io/js/request-ip.svg)](https://badge.fury.io/js/request-ip)

## Installation

Yarn
```
yarn add request-ip
```

npm
```bash
npm install request-ip --save
```
    
## Getting Started

```javascript
const requestIp = require('request-ip');

// inside middleware handler
const ipMiddleware = function(req, res, next) {
    const clientIp = requestIp.getClientIp(req); 
    next();
};

// on localhost you'll see 127.0.0.1 if you're using IPv4 
// or ::1, ::ffff:127.0.0.1 if you're using IPv6
```

### As Connect Middleware

```javascript
const requestIp = require('request-ip');
app.use(requestIp.mw())

app.use(function(req, res) {
    const ip = req.clientIp;
    res.end(ip);
});
```

To see a full working code for the middleware, check out the [examples](https://github.com/pbojinov/request-ip/tree/master/examples) folder.

The connect-middleware also supports retrieving the ip address under a custom attribute name, which also works as a container for any future settings. 

## How It Works

It looks for specific headers in the request and falls back to some defaults if they do not exist.

The user ip is determined by the following order:

1. `X-Client-IP`  
2. `X-Forwarded-For` (Header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP", so we take the first one.)
3. `CF-Connecting-IP` (Cloudflare)
4. `Fastly-Client-Ip` (Fastly CDN and Firebase hosting header when forwared to a cloud function)
5. `True-Client-Ip` (Akamai and Cloudflare)
6. `X-Real-IP` (Nginx proxy/FastCGI)
7. `X-Cluster-Client-IP` (Rackspace LB, Riverbed Stingray)
8. `X-Forwarded`, `Forwarded-For` and `Forwarded` (Variations of #2)
9. `appengine-user-ip` (Google App Engine)
10. `req.connection.remoteAddress`
11. `req.socket.remoteAddress`
12. `req.connection.socket.remoteAddress`
13. `req.info.remoteAddress`
14. `Cf-Pseudo-IPv4` (Cloudflare fallback)
15. `request.raw` (Fastify)

If an IP address cannot be found, it will return `null`.

## Samples Use Cases

* Getting a user's IP for geolocation.

## Security Warning
This library is not to be relied upon for security purposes due to the risk of IP address spoofing by malicious clients, who could insert a false IP into a high-priority header.

If you need to determine the IP securely, first determine how the clients will be connecting to your server:

* Direct Connections: Use the TCP connection IP from the request object.
* Through Proxies / Load Balancers: Identify the specific header used by your load balancer and parse that one only. Be aware of how your load balancer handles preexisting (spoofed) headers of that type. Commonly, the load balancer appends the client IP to the existing header, and therefore the legitimate IP is the rightmost entry. However if you have multiple chained proxies, each one will append to the header, and you'll either need to count leftwards from the right to find the true client IP, or set the later proxies in the chain to pass through the header unchanged.
* Some of both: it will be challenging to do this securely. You will need to determine on a case-by-case basis whether a request has definitely come through your proxy (probably by matching the TCP IP against that of your proxies) and only rely on the header if it has.


## Running the Tests

Make sure you have the necessary dev dependencies needed to run the tests:

```
npm install
```

Run the integration tests

```
npm test
```

## Building

Compiles the current ES6 code to ES5 using Babel.

```
npm build
```

## Release Notes

See the wonderful [changelog](https://github.com/pbojinov/request-ip/blob/master/CHANGELOG.md)

To generate a new changelog, install [github-changelog-generator](https://github.com/skywinder/github-changelog-generator) then run `npm run changelog`. This will require being on Ruby >= 3

## Contributors

Thank you to all the [contributors](https://github.com/pbojinov/request-ip/graphs/contributors)!

## License

The MIT License (MIT) - 2022
