# request-ip

A tiny Node.js module for retrieving a request's IP address. 

![](https://nodei.co/npm/request-ip.png?downloads=true&cacheBust=2)

![](https://travis-ci.org/pbojinov/request-ip.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/pbojinov/request-ip/badge.svg)](https://coveralls.io/r/pbojinov/request-ip)
![](https://img.shields.io/npm/l/express.svg)
[![npm version](https://badge.fury.io/js/request-ip.svg)](https://badge.fury.io/js/request-ip)

## Installation

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

The following is the order we use to determine the user ip from the request.

1. `X-Client-IP`  
2. `X-Forwarded-For` (Header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP", so we take the the first one.)
3. `CF-Connecting-IP` (Cloudflare)
4. `True-Client-Ip` (Akamai and Cloudflare)
5. `X-Real-IP` (Nginx proxy/FastCGI)
6. `X-Cluster-Client-IP` (Rackspace LB, Riverbed Stingray)
7. `X-Forwarded`, `Forwarded-For` and `Forwarded` (Variations of #2)
8. `req.connection.remoteAddress`
9. `req.socket.remoteAddress`
10. `req.connection.socket.remoteAddress`
11. `req.info.remoteAddress`

If an IP address cannot be found, it will return `null`.

## Samples Use Cases

* Getting a user's IP for geolocation.


## Running the Tests

Make sure you have the necessary dev dependencies needed to run the tests:

```
npm install
```

Run the integration tests

```
npm test
```

## Release Notes

See the wonderful [changelog](https://github.com/pbojinov/request-ip/blob/master/CHANGELOG.md)

To easily generate a new changelog, install [github-changelog-generator](https://github.com/skywinder/github-changelog-generator) then run `npm run changelog`.

## Contributors

* Thanks to [@osherx](https://github.com/osherx) for adding the connect-middleware.
* Thanks to [@raunc](https://github.com/raunc) for adding Squid proxy support.
* Thanks to [@fluxsauce](https://github.com/fluxsauce) for adding `CF-Connecting-IP`, `True-Client-IP`, and ES6 support.

## License

The MIT License (MIT) - 2017
