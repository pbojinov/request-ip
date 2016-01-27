var connect = require('connect');
var http = require('http');
var net = require('net');

var app = connect();

// require request-ip and register it as middleware
var requestIp = require('request-ip');

// you can override which attirbute the ip will be set on by
// passing in an options object with an attributeName
app.use(requestIp.mw({ attributeName : 'myCustomAttributeName' }))

// respond to all requests
app.use(function(req, res) {

    // use our custom attributeName that we registered in the middleware
    var ip = req.myCustomAttributeName;
    console.log(ip);

    // https://nodejs.org/api/net.html#net_net_isip_input
    var ipType = net.isIP(ip); // returns 0 for invalid, 4 for IPv4, and 6 for IPv6
    res.end('Hello, your ip address is ' + ip + ' and is of type IPv' + ipType + '\n');
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);

// test it locally from the command line
// > curl -X GET localhost:3000 # Hello, your ip address is ::1 and is of type IPv6