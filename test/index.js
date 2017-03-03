var http = require('http');
var test = require('tape');
var tapSpec = require('tap-spec');
var request = require('request');
var requestIp = require('../index.js');

// Setup local server for testing
var serverInfo = {
    host: '127.0.0.1'
};

function serverFactory() {
    return http.createServer(function(req, res) {
        // res.writeHead(200, {'Content-Type': 'text/plain'});
        var ip = requestIp.getClientIp(req);
        res.end(ip);
    });
}

test('req.headers is undefined', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'x-testing-null-condition-so-delete-everything': true
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    // node listens on a random port when using 0
    // http://stackoverflow.com/questions/9901043/how-does-node-js-choose-random-ports
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        // we can't make the request URL until we get the port number from the new server
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        /*
            ------------------------------------------------------------------
            Example Server Response (response)
            You can inspect it using: t.comment(JSON.stringify(response));
            ------------------------------------------------------------------
            {
                "body": "",
                "headers": {
                    "connection": "close",
                    "content-length": "0",
                    "date": "Fri, 03 Mar 2017 21:24:12 GMT"
                },
                "request": {
                    "headers": {
                        "x-testing-null-condition-so-delete-everything": true
                    },
                    "method": "GET",
                    "uri": {
                        "auth": null,
                        "hash": null,
                        "host": "127.0.0.1:56558",
                        "hostname": "127.0.0.1",
                        "href": "http://127.0.0.1:56558/",
                        "path": "/",
                        "pathname": "/",
                        "port": "56558",
                        "protocol": "http:",
                        "query": null,
                        "search": null,
                        "slashes": true
                    }
                },
                "statusCode": 200
            }
        */
        if (!error && response.statusCode === 200) {
            t.equal("", body);
            server.close();
        }
    }
});



test('x-client-ip', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'x-client-ip': '59.195.114.48'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    // node listens on a random port when using 0
    // http://stackoverflow.com/questions/9901043/how-does-node-js-choose-random-ports
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        // we can't make the request URL until we get the port number from the new server
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            t.equal(options.headers['x-client-ip'], body);
            server.close();
        }
    }
});

test('x-forwarded-for', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'x-forwarded-for': '129.78.138.66, 129.78.64.103, 129.78.64.105'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            var firstIp = options.headers['x-forwarded-for'].split(',')[0].trim();
            t.equal(firstIp, body);
            server.close();
        }
    }
});

test('x-forwarded-for with unknown first ip', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'x-forwarded-for': 'unknown, 93.186.30.120'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            var secondIp = options.headers['x-forwarded-for'].split(',')[1].trim();
            t.equal(secondIp, body);
            server.close();
        }
    }
});

test('cf-connecting-ip', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'cf-connecting-ip': '8.8.8.8'
        }
    };
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            t.equal(options.headers['cf-connecting-ip'], body);
            server.close();
        }
    }
});

test('true-client-ip', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'true-client-ip': '8.8.8.8'
        }
    };
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            t.equal(options.headers['true-client-ip'], body);
            server.close();
        }
    }
});

test('x-real-ip', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'x-real-ip': '129.78.138.66'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            t.equal(options.headers['x-real-ip'], body);
            server.close();
        }
    }
});

test('x-cluster-client-ip', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'x-cluster-client-ip': '10.0.10.100'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            t.equal(options.headers['x-cluster-client-ip'], body);
            server.close();
        }
    }
});

test('x-forwarded', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'x-forwarded': '230.38.161.74'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            t.equal(options.headers['x-forwarded'], body);
            server.close();
        }
    }
});

test('forwarded-for', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'forwarded-for': '102.71.123.2'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            t.equal(options.headers['forwarded-for'], body);
            server.close();
        }
    }
});

test('forwarded', function(t) {
    t.plan(1);
    var options = {
        url: '',
        headers: {
            'forwarded': '102.71.123.2'
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // make sure response ip is the same as the one we passed in
            t.equal(options.headers['forwarded'], body);
            server.close();
        }
    }
});

test('req.connection.remoteAddress', function(t) {
    t.plan(1);
    var options = {
        url: ''
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // ip address should be equal to the server host we used at the top
            t.equal(serverInfo.host, body);
            server.close();
        }
    }
});

test('request-ip.mw -', function(t) {
    t.plan(2);
    
    t.equal(typeof requestIp.mw, 'function', 'requestIp.mw - should be a factory function');
    t.equal(requestIp.mw.length, 1, 'requestIp.mw expects 1 argument - options');
});

test('request-ip.mw - used with no arguments', function(t) {
    t.plan(2);
    var mw = requestIp.mw();
    t.ok(typeof mw == 'function' && mw.length == 3, 'returns a middleware');
    
    var mockReq = { headers : { 'x-forwarded-for' : "111.222.111.222"} };
    mw( mockReq, null, function() { 
        t.equal(mockReq.clientIp, "111.222.111.222", "when used - the middleware augments the request object with attribute 'clientIp'" );  
    });
});

test('request-ip.mw - user code customizes augmented attribute name', function(t) {
    t.plan(2);
    var mw = requestIp.mw({ attributeName : "realIp" });
    t.ok(typeof mw == 'function' && mw.length == 3, 'returns a middleware');
    
    var mockReq = { headers : { 'x-forwarded-for' : "111.222.111.222"} };
    mw( mockReq, null, function() { 
        t.equal(mockReq.realIp, "111.222.111.222", "when used - the middleware augments the request object with attribute name provided by user-code" );  
    });
});

test('android request to AWS EBS app (x-forwarded-for)', function(t) {
    t.plan(1);
    // 172.x.x.x and 192.x.x.x. are considered "private IP subnets"
    // so we want to library to return "107.77.213.113" as the IP address
    // https://tools.ietf.org/html/rfc1918#section-3
    var expectedResult = '107.77.213.113';
    var options = {
        url: '',
        headers: {
            "host": "[redacted]",
            "x-real-ip": "172.31.41.116",
            "x-forwarded-for": "107.77.213.113, 172.31.41.116",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/3.4.1",
            "x-forwarded-port": "443",
            "x-forwarded-proto": "https"
        }
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    var server = new serverFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', function() {
        options.url = 'http://' + serverInfo.host + ':' + server.address().port;
        request(options, callback);
    });

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            // ip address should be equal to the first "x-forwarded-for" value
            // console.log(body)
            // t.comment(body)
            t.equal(expectedResult, body);
            server.close();
        }
    }
});