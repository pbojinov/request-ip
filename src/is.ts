import { IRegexes } from './index.d';

/**
 * Inspired by and credit to is_js [https://github.com/arasatasaygin/is.js]
 */

const regexes: IRegexes = {
  ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
  ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
};

/**
 * Helper function which reverses the sense of predicate result
 * @param {*} func
 * @returns
 */
function not(func: any): any {
  return function () {
    return !func.apply(null, Array.prototype.slice.call(arguments));
  };
}

/**
 * Replaces is.existy from is_js.
 * @param {*} value - The value to test
 * @returns {boolean} True if the value is defined, otherwise false
 */
function existy(value: any): boolean {
  return value != null;
}

/**
 * Replaces is.ip from is_js.
 * @param {*} value - The value to test
 * @returns {boolean} True if the value is an IP address, otherwise false
 */
function ip(value: string): boolean {
  return (existy(value) && regexes.ipv4.test(value)) || regexes.ipv6.test(value);
}

/**
 * Replaces is.object from is_js.
 * @param {*} value - The value to test
 * @returns {boolean} True if the value is an object, otherwise false
 */
function object(value: object): boolean {
  return Object(value) === value;
}

/**
 * Replaces is,.string from is_js.
 * @param {*} value - The value to test
 * @returns True if the value is a string, otherwise false
 */
function string(value: string): boolean {
  return Object.prototype.toString.call(value) === '[object String]';
}

const is = {
  existy: existy,
  ip: ip,
  object: object,
  string: string,
  not: {
    existy: not(existy),
    ip: not(ip),
    object: not(object),
    string: not(string),
  },
};

export default is;
