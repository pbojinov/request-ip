request-ip
=========

> A tiny Node.js module to retrieve a request's IP address. 

> Maintainer: [Petar Bojinov](https://github.com/pbojinov)


## Installation

    npm install request-ip
    
![](https://nodei.co/npm/request-ip.png?downloads=true)
  
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

**request-ip** looks for three specific headers in the request and falls back some defaults if they do not exist

The following is the order we use to determine the user ip from the request.

1. `X-Client-IP`  
2. `X-Forwarded-For` header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP", so we take the the first one.
3. `X-Real-IP`
4. `req.connection.remoteAddress`
5. `req.socket.remoteAddress`
6. `req.connection.socket.remoteAddress`

## Use Case

Getting a user's IP for geolocation.

## Dependencies

None

## Release Notes

1.0.0

* add semver

0.0.4

* add support for X-Real-Ip
* bug fixes

0.0.3

* improve docs

0.0.2

* bug fix

0.0.1

* initial release

## License

The MIT License (MIT)
