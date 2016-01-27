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
    var clientIp = requestIp.getClientIp(req); 
    next();
};

// on localhost you'll see 127.0.0.1 if you're using IPv4 
// or ::1, ::ffff:127.0.0.1 if you're using IPv6
```

### As Connect Middleware

```javascript
var requestIp = require('request-ip');
app.use(requestIp.mw())

app.use(function(req, res) {
    var ip = req.clientIp;
    res.end(ip);
});
```

To see a full working code for the middleware, check out the [examples](https://github.com/pbojinov/request-ip/tree/master/examples) folder.

The connect-middleware also supports retrieving the ip address under a custom attribute name, which also works as a container for any future settings. 

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
10. `req.info.remoteAddress`

If cannot find an IP address, it will return `null`.

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

See the wonderful [changelog](https://github.com/pbojinov/request-ip/blob/master/CHANGELOG.md)

To easily generate a new changelog, install [github-changelog-generator](https://github.com/skywinder/github-changelog-generator) then run `npm run changelog`.

## Contributors

Thanks to [@osherx](https://github.com/osherx) for adding the connect-middleware.

## License

The MIT License (MIT) - 2016
