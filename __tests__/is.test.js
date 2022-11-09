const is = require('../src/is.js');

test('existy returns false for non-existent values', () => {
    expect.assertions(2);
    expect(is.existy(null)).toBeFalsy();
    expect(is.existy(undefined)).toBeFalsy();
});

test('existy returns true on existent values', () => {
    expect.assertions(9);
    expect(is.existy(0)).toBeTruthy();
    expect(is.existy(1)).toBeTruthy();
    expect(is.existy({})).toBeTruthy();
    expect(is.existy(NaN)).toBeTruthy();
    expect(is.existy('')).toBeTruthy();
    expect(is.existy('hello')).toBeTruthy();
    expect(is.existy(new Date())).toBeTruthy();
    expect(is.existy([1, 2])).toBeTruthy();
    expect(is.existy([])).toBeTruthy();
});

test('ip returns false for non-IP values', () => {
    expect.assertions(6);
    expect(is.ip(null)).toBeFalsy();
    expect(is.ip(undefined)).toBeFalsy();
    expect(is.ip(3)).toBeFalsy();
    expect(is.ip('hello')).toBeFalsy();
    expect(is.ip(123.123)).toBeFalsy();
    expect(is.ip('test:test:test:test:test:test:test:test')).toBeFalsy();
});

test('ip returns true for IP values', () => {
    expect.assertions(3);
    expect(is.ip('127.0.0.1')).toBeTruthy();
    expect(is.ip('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBeTruthy();
    expect(is.ip('FE80:0000:0000:0000:0202:B3FF:FE1E:8329')).toBeTruthy();
});

test('string returns false for non-string values', () => {
    expect.assertions(8);
    expect(is.string(null)).toBeFalsy();
    expect(is.string(undefined)).toBeFalsy();
    expect(is.string(1)).toBeFalsy();
    expect(is.string(new Date())).toBeFalsy();
    expect(is.string({})).toBeFalsy();
    expect(is.string({string: 'string '})).toBeFalsy();
    expect(is.string([])).toBeFalsy();
    expect(is.string(['string'])).toBeFalsy();
});

test('string returns true for string values', () => {
    expect.assertions(1);
    expect(is.string('127.0.0.1')).toBeTruthy();
});

test('object returns false for non-object values', () => {
    expect.assertions(4);
    expect(is.object(null)).toBeFalsy();
    expect(is.object(undefined)).toBeFalsy();
    expect(is.object(1)).toBeFalsy();
    expect(is.object('string')).toBeFalsy();
});

test('object returns true for object values', () => {
    expect.assertions(5);
    expect(is.object({})).toBeTruthy();
    expect(is.object({object: 'object '})).toBeTruthy();
    expect(is.object(new Date())).toBeTruthy();
    expect(is.object([])).toBeTruthy();
    expect(is.object(['object'])).toBeTruthy();
});

test('not reverses all tests', () => {
    expect.assertions(8);
    expect(is.not.string(1)).toBeTruthy();
    expect(is.not.object(1)).toBeTruthy();
    expect(is.not.ip(1)).toBeTruthy();
    expect(is.not.existy(null)).toBeTruthy();
    expect(is.not.string('string')).toBeFalsy();
    expect(is.not.object({object: 'object'})).toBeFalsy();
    expect(is.not.ip('127.0.0.1')).toBeFalsy();
    expect(is.not.existy(1)).toBeFalsy();
});
