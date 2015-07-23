#request-ip

A tiny Node.js module for retrieving a request's IP address. 

![](https://nodei.co/npm/request-ip.png?downloads=true&cacheBust=2)

![](https://travis-ci.org/pbojinov/request-ip.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/pbojinov/request-ip/badge.svg)](https://coveralls.io/r/pbojinov/request-ip)

## Installation

    npm install request-ip --save
    
## Getting Started

```javascript
var requestIp = require('request-ip');

// inside middleware handler
var ipMiddleware = function(req, res, next) {
    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
    next();
};
```

## How It Works

It looks for specific headers in the request and falls back to some defaults if they do not exist.

The following is the order we use to determine the user ip from the request.

1. `X-Client-IP`  
2. `X-Forwarded-For` header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP", so we take the the first one.
3. `X-Real-IP` (nginx proxy/FastCGI)
5. `X-Cluster-Client-IP` (Rackspace LB, Riverbed Stingray)
6. Permuations of #2 such as: `X-Forwarded`, `Forwarded-For` and `Forwarded`
7. `req.connection.remoteAddress`
8. `req.socket.remoteAddress`
9. `req.connection.socket.remoteAddress`

If cannot find an IP address, return `null`.

## Samples Use Cases

* Getting a user's IP for geolocation.

## Dependencies

None

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

1.1.4

* * add case management where you can not find the IP address, so we return NULL

1.1.3

* move Coveralls from dependencies to devDependencies, oops

1.1.2

* add support for Travis CI
* add code coverage through Coveralls

1.1.0

* add support for X-Cluster-Client-IP, X-Forwarded, Forwarded-For, Forwarded
* add tests

1.0.0

* production ready with stable API
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
