const http = require('http');
const request = require('request');
const requestIp = require('../src/index.js');
const tapSpec = require('tap-spec');
const test = require('tape');

test.createStream().pipe(tapSpec()).pipe(process.stdout);

// Setup local server for testing
const serverInfo = {
    host: '127.0.0.1',
};

/**
 * Create a new server for each test so we can easily close it after the test is done.
 * This prevents tests from hanging and competing against closing a global server
 * @constructor
 */
function ServerFactory() {
    return http.createServer((req, res) => {
        res.end(requestIp.getClientIp(req));
    });
}

test('req.headers is undefined', (t) => {
    t.plan(1);
    const options = {
        url: '',
    };
    const server = new ServerFactory();
    // node listens on a random port when using 0
    // http://stackoverflow.com/questions/9901043/how-does-node-js-choose-random-ports
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        // we can't make the request URL until we get the port number from the new server
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                t.equal(found, '127.0.0.1');
                server.close();
            }
        });
    });
});

test('getClientIpFromXForwardedFor', (t) => {
    t.plan(3);
    t.equal(requestIp.getClientIpFromXForwardedFor('107.77.213.113, 172.31.41.116'), '107.77.213.113');
    t.equal(requestIp.getClientIpFromXForwardedFor('unknown, unknown'), undefined);
    t.throws(() => requestIp.getClientIpFromXForwardedFor({}), TypeError);
});

test('x-client-ip', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'x-client-ip': '59.195.114.48',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    // node listens on a random port when using 0
    // http://stackoverflow.com/questions/9901043/how-does-node-js-choose-random-ports
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        // we can't make the request URL until we get the port number from the new server
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                t.equal(options.headers['x-client-ip'], found);
                server.close();
            }
        });
    });
});

test('x-forwarded-for', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'x-forwarded-for': '129.78.138.66, 129.78.64.103, 129.78.64.105',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                const firstIp = options.headers['x-forwarded-for'].split(',')[0].trim();
                t.equal(firstIp, found);
                server.close();
            }
        });
    });
});

test('x-forwarded-for with unknown first ip', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'x-forwarded-for': 'unknown, 93.186.30.120',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                const secondIp = options.headers['x-forwarded-for'].split(',')[1].trim();
                t.equal(secondIp, found);
                server.close();
            }
        });
    });
});

test('x-forwarded-for with ipv4:port', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'x-forwarded-for': '93.186.30.120:12345',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                const firstIp = options.headers['x-forwarded-for'].split(',')[0].trim().split(':')[0];
                t.equal(firstIp, found);
                server.close();
            }
        });
    });
});

test('cf-connecting-ip', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'cf-connecting-ip': '8.8.8.8',
        },
    };
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                t.equal(options.headers['cf-connecting-ip'], found);
                server.close();
            }
        });
    });
});

test('true-client-ip', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'true-client-ip': '8.8.8.8',
        },
    };
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                t.equal(options.headers['true-client-ip'], found);
                server.close();
            }
        });
    });
});

test('x-real-ip', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'x-real-ip': '129.78.138.66',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                t.equal(options.headers['x-real-ip'], found);
                server.close();
            }
        });
    });
});

test('x-cluster-client-ip', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'x-cluster-client-ip': '10.0.10.100',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                t.equal(options.headers['x-cluster-client-ip'], found);
                server.close();
            }
        });
    });
});

test('x-forwarded', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'x-forwarded': '230.38.161.74',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                t.equal(options.headers['x-forwarded'], found);
                server.close();
            }
        });
    });
});

test('forwarded-for', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            'forwarded-for': '102.71.123.2',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                t.equal(options.headers['forwarded-for'], found);
                server.close();
            }
        });
    });
});

test('forwarded', (t) => {
    t.plan(1);
    const options = {
        url: '',
        headers: {
            forwarded: '102.71.123.2',
        },
    };
    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // make sure response ip is the same as the one we passed in
                t.equal(options.headers.forwarded, found);
                server.close();
            }
        });
    });
});

test('req.connection.remoteAddress', (t) => {
    t.plan(1);
    const options = {
        url: '',
    };
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                t.equal(found, serverInfo.host);
                server.close();
            }
        });
    });
});

test('req.connection.socket.remoteAddress', (t) => {
    t.plan(1);
    const options = {
        url: '',
    };
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // ip address should be equal to the server host we used at the top
                t.equal(found, serverInfo.host);
                server.close();
            }
        });
    });
});

test('getClientIp - req.connection.remoteAddress', (t) => {
    t.plan(1);
    const found = requestIp.getClientIp({
        connection: {
            remoteAddress: '172.217.6.78',
        },
    });
    t.equal(found, '172.217.6.78');
});

test('getClientIp - req.connection.socket.remoteAddress', (t) => {
    t.plan(2);
    const mockReq = {
        connection: {
            socket: {
                remoteAddress: '206.190.36.45',
            },
        },
    };
    t.equal(requestIp.getClientIp(mockReq), '206.190.36.45');
    mockReq.connection.socket.remoteAddress = 'fail';
    t.equal(requestIp.getClientIp(mockReq), null);
});

test('req.socket.remoteAddress', (t) => {
    t.plan(1);
    const found = requestIp.getClientIp({
        socket: {
            remoteAddress: '204.79.197.200',
        },
    });
    t.equal(found, '204.79.197.200');
});

test('getClientIp - req.info.remoteAddress', (t) => {
    t.plan(1);
    const found = requestIp.getClientIp({
        info: {
            remoteAddress: '50.18.192.250',
        },
    });
    t.equal(found, '50.18.192.250');
});

test('getClientIp - req.requestContext.identity.sourceIp', (t) => {
    t.plan(1);
    const found = requestIp.getClientIp({
        requestContext: {
            identity: {
                sourceIp: '50.18.192.250',
            },
        },
    });
    t.equal(found, '50.18.192.250');
});

test('getClientIp - default', (t) => {
    t.plan(1);
    const found = requestIp.getClientIp({});
    t.equal(found, null);
});

test('request-ip.mw', (t) => {
    t.plan(3);
    t.equal(typeof requestIp.mw, 'function', 'requestIp.mw - should be a factory function');
    t.equal(requestIp.mw.length, 1, 'requestIp.mw expects 1 argument - options');
    t.throws(() => requestIp.mw('fail'), TypeError);
});

test('request-ip.mw - used with no arguments', (t) => {
    t.plan(2);
    const mw = requestIp.mw();
    t.ok(typeof mw === 'function' && mw.length === 3, 'returns a middleware');

    const mockReq = { headers: { 'x-forwarded-for': '111.222.111.222' } };
    mw(mockReq, null, () => {
        t.equal(mockReq.clientIp, '111.222.111.222', "when used - the middleware augments the request object with attribute 'clientIp'");
    });
});

test('request-ip.mw - user code customizes augmented attribute name', (t) => {
    t.plan(2);
    const mw = requestIp.mw({ attributeName: 'realIp' });
    t.ok(typeof mw === 'function' && mw.length === 3, 'returns a middleware');

    const mockReq = { headers: { 'x-forwarded-for': '111.222.111.222' } };
    mw(mockReq, null, () => {
        t.equal(mockReq.realIp, '111.222.111.222', 'when used - the middleware augments the request object with user-specified attribute name ');
    });
});

test('request-ip.mw - attribute has getter by Object.defineProperty', (t) => {
    t.plan(2);
    const mw = requestIp.mw();
    t.ok(typeof mw === 'function' && mw.length === 3, 'returns a middleware');

    const mockReq = { headers: { 'x-forwarded-for': '111.222.111.222' } };
    Object.defineProperty(mockReq, 'clientIp', {
        enumerable: true,
        configurable: true,
        get: () => '1.2.3.4',
    });
    mw(mockReq, null, () => {
        t.equal(mockReq.clientIp, '111.222.111.222', "when used - the middleware augments the request object with attribute 'clientIp'");
    });
});

test('android request to AWS EBS app (x-forwarded-for)', (t) => {
    t.plan(1);
    // 172.x.x.x and 192.x.x.x. are considered "private IP subnets"
    // so we want to library to return "107.77.213.113" as the IP address
    // https://tools.ietf.org/html/rfc1918#section-3
    const wanted = '107.77.213.113';
    const options = {
        url: '',
        headers: {
            host: '[redacted]',
            'x-real-ip': '172.31.41.116',
            'x-forwarded-for': '107.77.213.113, 172.31.41.116',
            'accept-encoding': 'gzip',
            'user-agent': 'okhttp/3.4.1',
            'x-forwarded-port': '443',
            'x-forwarded-proto': 'https',
        },
    };

    // create new server for each test so we can easily close it after the test is done
    // prevents tests from hanging and competing against closing a global server
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // ip address should be equal to the first "x-forwarded-for" value
                t.equal(found, wanted);
                server.close();
            }
        });
    });
});
