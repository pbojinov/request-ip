request-ip
=========

> A tiny Node.js module to retrieve a request's IP address. 

> Maintainer: [Petar Bojinov](https://github.com/pbojinov)

## Use Case

Getting the user's IP for geolocation.

## Installation

    npm install request-ip
  
## Getting Started

```javascript
var requestIp = require('request-ip');

// inside middleware handler
var ipMiddleware = function(req, res, next) {
    var clientIp = requestIp.getClientIp(req); // on loaclhost > 127.0.0.1
    next();
};
```

## How It Works

**request-ip** looks for two specific headers in the request and falls back to `req.connection.remoteAddress`. The following is the order we use to determine the user ip from the request.

1. `X-Client-IP`  
2. `X-Forwarded-For` header may return multiple IP addresses in the format: "client IP, proxy 1 IP,proxy 2 IP", so we take the the first one.
3. `req.connection.remoteAddress`

## Dependencies

None

## Release Notes

0.0.1

* initial release

## License

The MIT License (MIT)