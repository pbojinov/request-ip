const http = require('http');

const request = require('request');

const requestIp = require('../src/index.js');

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

test('req.headers is undefined', (done) => {
    expect.assertions(1);
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
                expect(found).toBe('127.0.0.1');
                server.close();
                done();
            }
        });
    });
});

test('getClientIpFromXForwardedFor', () => {
    expect.assertions(3);
    expect(requestIp.getClientIpFromXForwardedFor('107.77.213.113, 172.31.41.116')).toBe('107.77.213.113');
    expect(requestIp.getClientIpFromXForwardedFor('unknown, unknown')).toBe(null);
    expect(() => requestIp.getClientIpFromXForwardedFor({})).toThrowError(TypeError);
});

test('x-client-ip', (done) => {
    expect.assertions(1);
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
                expect(options.headers['x-client-ip']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('fastly-client-ip', (done) => {
    expect.assertions(1);
    const options = {
        url: '',
        headers: {
            'fastly-client-ip': '59.195.114.48',
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
                expect(options.headers['fastly-client-ip']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('x-forwarded-for', (done) => {
    expect.assertions(1);
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
                const lastIp = options.headers['x-forwarded-for']
                    .split(',')[0]
                    .trim();
                expect(lastIp).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('x-forwarded-for with unknown first ip', (done) => {
    expect.assertions(1);
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
                const secondIp = options.headers['x-forwarded-for']
                    .split(',')[1]
                    .trim();
                expect(secondIp).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('x-forwarded-for with ipv4:port', (done) => {
    expect.assertions(1);
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
                const firstIp = options.headers['x-forwarded-for']
                    .split(',')[0]
                    .trim()
                    .split(':')[0];
                expect(firstIp).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('cf-connecting-ip', (done) => {
    expect.assertions(1);
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
                expect(options.headers['cf-connecting-ip']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('true-client-ip', (done) => {
    expect.assertions(1);
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
                expect(options.headers['true-client-ip']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('x-real-ip', (done) => {
    expect.assertions(1);
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
                expect(options.headers['x-real-ip']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('x-cluster-client-ip', (done) => {
    expect.assertions(1);
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
                expect(options.headers['x-cluster-client-ip']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('x-forwarded', (done) => {
    expect.assertions(1);
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
                expect(options.headers['x-forwarded']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('forwarded-for', (done) => {
    expect.assertions(1);
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
                expect(options.headers['forwarded-for']).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('forwarded', (done) => {
    expect.assertions(1);
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
                expect(options.headers.forwarded).toBe(found);
                server.close();
                done();
            }
        });
    });
});

test('req.connection.remoteAddress', (done) => {
    expect.assertions(1);
    const options = {
        url: '',
    };
    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                expect(found).toBe(serverInfo.host);
                server.close();
                done();
            }
        });
    });
});

test('req.connection.socket.remoteAddress', (done) => {
    expect.assertions(1);
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
                expect(found).toBe(serverInfo.host);
                server.close();
                done();
            }
        });
    });
});

test('getClientIp - req.connection.remoteAddress', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        connection: {
            remoteAddress: '172.217.6.78',
        },
    });
    expect(found).toBe('172.217.6.78');
});

test('getClientIp - req.connection.socket.remoteAddress', () => {
    expect.assertions(2);
    const mockReq = {
        connection: {
            socket: {
                remoteAddress: '206.190.36.45',
            },
        },
    };
    expect(requestIp.getClientIp(mockReq)).toBe('206.190.36.45');
    mockReq.connection.socket.remoteAddress = 'fail';
    expect(requestIp.getClientIp(mockReq)).toBe(null);
});

test('req.socket.remoteAddress', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        socket: {
            remoteAddress: '204.79.197.200',
        },
    });
    expect(found).toBe('204.79.197.200');
});

test('getClientIp - req.info.remoteAddress', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        info: {
            remoteAddress: '50.18.192.250',
        },
    });
    expect(found).toBe('50.18.192.250');
});

test('getClientIp - req.requestContext.identity.sourceIp', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        requestContext: {
            identity: {
                sourceIp: '50.18.192.250',
            },
        },
    });
    expect(found).toBe('50.18.192.250');
});

test('getClientIp - default', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({});
    expect(found).toBe(null);
});

test('request-ip.mw', () => {
    expect.assertions(3);
    expect(typeof requestIp.mw).toBe('function');
    expect(requestIp.mw.length).toBe(1);
    expect(() => requestIp.mw('fail')).toThrowError(TypeError);
});

test('request-ip.mw - used with no arguments', () => {
    expect.assertions(2);
    const mw = requestIp.mw();
    expect(typeof mw === 'function' && mw.length === 3).toBeTruthy();

    const mockReq = { headers: { 'x-forwarded-for': '111.222.111.222' } };
    mw(mockReq, null, () => {
        expect(mockReq.clientIp).toBe('111.222.111.222');
    });
});

test('request-ip.mw - user code customizes augmented attribute name', () => {
    expect.assertions(2);
    const mw = requestIp.mw({ attributeName: 'realIp' });
    expect(typeof mw === 'function' && mw.length === 3).toBeTruthy();

    const mockReq = { headers: { 'x-forwarded-for': '111.222.111.222' } };
    mw(mockReq, null, () => {
        expect(mockReq.realIp).toBe('111.222.111.222');
    });
});

test('request-ip.mw - attribute has getter by Object.defineProperty', () => {
    expect.assertions(2);
    const mw = requestIp.mw();
    expect(typeof mw === 'function' && mw.length === 3).toBeTruthy();

    const mockReq = { headers: { 'x-forwarded-for': '111.222.111.222' } };
    Object.defineProperty(mockReq, 'clientIp', {
        enumerable: true,
        configurable: true,
        get: () => '1.2.3.4',
    });
    mw(mockReq, null, () => {
        expect(mockReq.clientIp).toBe('111.222.111.222');
    });
});

test('android request to AWS EBS app (x-forwarded-for)', (done) => {
    expect.assertions(1);
    // 172.x.x.x and 192.x.x.x. are considered "private IP subnets"
    // so we want to library to return "107.77.213.113" as the IP address
    // https://tools.ietf.org/html/rfc1918#section-3
    const wanted = '107.77.213.113';
    const options = {
        url: '',
        headers: {
            host: '[redacted]',
            'x-real-ip': '172.31.41.116',
            'x-forwarded-for': `${wanted}, 172.31.41.116`,
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
                expect(found).toBe(wanted);
                server.close();
                done();
            }
        });
    });
});

test('request to Google Cloud App Engine (x-appengine-user-ip)', (done) => {
    expect.assertions(1);
    const wanted = '107.77.213.113';
    const options = {
        url: '',
        headers: {
            host: '[redacted]',
            'x-appengine-user-ip': '107.77.213.113',
        },
    };

    const server = new ServerFactory();
    server.listen(0, serverInfo.host);
    server.on('listening', () => {
        options.url = `http://${serverInfo.host}:${server.address().port}`;
        request(options, (error, response, found) => {
            if (!error && response.statusCode === 200) {
                // ip address should be equal to the first "x-appengine-user-ip" value
                expect(found).toBe(wanted);
                server.close();
                done();
            }
        });
    });
});

test('Fastify (request.raw) found', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        raw: {
            headers: {
                forwarded: '91.203.163.199',
            },
        },
    });
    expect(found).toBe('91.203.163.199');
});

test('Fastify (request.raw) not found', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        raw: {},
    });
    expect(found).toBe(null);
});

test('Cf-Pseudo-IPv4 – Cloudflare fallback', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        headers: {
            'Cf-Pseudo-IPv4': '29.74.48.74',
        },
    });
    expect(found).toBe('29.74.48.74');
});

test('Cf-Pseudo-IPv4 is not used when other valid headers exist', () => {
    expect.assertions(1);
    const found = requestIp.getClientIp({
        headers: {
            'Cf-Pseudo-IPv4': '29.74.48.74',
            'x-forwarded-for': '129.78.138.66',
        },
    });
    expect(found).toBe('129.78.138.66');
});
