request-ip
=========

> A small node.js module to retrieve the request's IP address

Maintainer: [Petar Bojinov](https://github.com/pbojinov)

## Installation

    npm install request-ip
  
## Getting Started

```javascript
var request-ip = require('request-ip');

// inside middleware handler
var ipMiddleware = function(req, res, next) {
    var clientIp = request-ip.getClientIp(req); // on loaclhost > 127.0.0.1
    next();
};
```

## Dependencies

None

## License

The MIT License (MIT)
