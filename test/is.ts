import is from '../src/is';
import test from 'tape';

test('existy returns false for non-existent values', t => {
  t.plan(2);
  t.notOk(is.existy(null), 'null is not existy');
  t.notOk(is.existy(undefined), 'undefined is not existy');
});

test('existy returns true on existent values', t => {
  t.plan(9);
  t.ok(is.existy(0), '0 is existy');
  t.ok(is.existy(1), '1 is existy');
  t.ok(is.existy({}), '{} is existy');
  t.ok(is.existy(NaN), 'NaN is existy');
  t.ok(is.existy(''), 'Empty string is existy');
  t.ok(is.existy('hello'), '"hello" is existy');
  t.ok(is.existy(new Date()), 'Date is existy');
  t.ok(is.existy([1, 2]), 'Array is existy');
  t.ok(is.existy([]), 'Empty array is existy');
});

test('ip returns false for non-IP values', t => {
  t.plan(6);
  t.notOk(is.ip(null), 'null is not an IP');
  t.notOk(is.ip(undefined), 'undefined is not an IP');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.ip(3), '3 is not an IP');
  t.notOk(is.ip('hello'), '"hello"" is not an IP');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.ip(123.123), '123.123 is not an IP');
  t.notOk(is.ip('test:test:test:test:test:test:test:test'), '"test:test:test:test:test:test:test:test" is not an IP');
});

test('ip returns true for IP values', t => {
  t.plan(3);
  t.ok(is.ip('127.0.0.1'), '127.0.0.1 is an IP');
  t.ok(is.ip('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), '2001:0db8:85a3:0000:0000:8a2e:0370:7334 is an IP');
  t.ok(is.ip('FE80:0000:0000:0000:0202:B3FF:FE1E:8329'), 'FE80:0000:0000:0000:0202:B3FF:FE1E:8329 is an IP');
});

test('string returns false for non-string values', t => {
  t.plan(8);
  t.notOk(is.string(null), 'null is not a string');
  t.notOk(is.string(undefined), 'undefined is not a string');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.string(1), '1 is not a string');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.string(new Date()), 'Date is not a string');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.string({}), '{} is not a string');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.string({ string: 'string ' }), '{ string: "string "} is not a string');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.string([]), '[] is not a string');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.string(['string']), '["string"] is not a string');
});

test('string returns true for string values', t => {
  t.plan(1);
  t.ok(is.string('127.0.0.1'), '127.0.0.1 is a string');
});

test('object returns false for non-object values', t => {
  t.plan(4);
  t.notOk(is.object(null), 'null is not an object');
  t.notOk(is.object(undefined), 'undefined is not an object');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.object(1), '1 is not an object');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  t.notOk(is.object('string'), '"string" is not an object');
});

test('object returns true for object values', t => {
  t.plan(5);
  t.ok(is.object({}), '{} is an object');
  t.ok(is.object({ object: 'object ' }), '{ object: "object "} is an object');
  t.ok(is.object(new Date()), 'Date is an object');
  t.ok(is.object([]), '[] is an object');
  t.ok(is.object(['object']), '["object"] is an object');
});

test('not reverses all tests', t => {
  t.plan(8);
  t.ok(is.not.string(1), '1 is not a string');
  t.ok(is.not.object(1), '1 is not an object');
  t.ok(is.not.ip(1), '1 is not an IP');
  t.ok(is.not.existy(null), '1 is not existy');
  t.notOk(is.not.string('string'), '"string" is not not a string');
  t.notOk(is.not.object({ object: 'object' }), '{object:"object"} is not not an object');
  t.notOk(is.not.ip('127.0.0.1'), '"127.0.0.1" is not not an IP');
  t.notOk(is.not.existy(1), '1 is not not existy');
});
