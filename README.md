request-ip
=========

> A tiny Node.js module to retrieve a request's IP address. 

> Maintainer: [Petar Bojinov](https://github.com/pbojinov)

## Installation

    npm install request-ip
    
![](https://nodei.co/npm/request-ip.png?downloads=true&cacheBust=1)
  
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
5. `X-Cluster-Client-IP`
6. Permuations of #2 such as: `X-Forwarded`, `Forwarded-For` and `Forwarded`
7. `req.connection.remoteAddress`
8. `req.socket.remoteAddress`
9. `req.connection.socket.remoteAddress`

## Use Case

Getting a user's IP for geolocation.

## Dependencies

None

## Running the Tests

Make sure you have the necessary dependencies:

```
npm install
```

Run the integration tests

```
npm test
```

## Release Notes

1.1.0

* add support for X-Cluster-Client-IP, X-Forwarded, Forwarded-For, Forwarded
* add tests

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
