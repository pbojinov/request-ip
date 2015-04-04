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
            var firstIp = options.headers['x-forwarded-for'].split(',')[0];
            t.equal(firstIp, body);
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

