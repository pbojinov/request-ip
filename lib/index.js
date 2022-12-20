"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var is = require('./is');
var defaultHeaderPrioritylist = ['x-client-ip', 'x-forwarded-for', 'cf-connecting-ip', 'fastly-client-ip', 'true-client-ip', 'x-real-ip', 'x-cluster-client-ip', 'x-forwarded', 'forwarded-for', 'forwarded', 'x-appengine-user-ip'];
var headerPriorityList = defaultHeaderPrioritylist;
function getClientIpFromXForwardedFor(value) {
  if (!is.existy(value)) {
    return null;
  }
  if (is.not.string(value)) {
    throw new TypeError("Expected a string, got \"".concat(_typeof(value), "\""));
  }
  var forwardedIps = value.split(',').map(function (e) {
    var ip = e.trim();
    if (ip.includes(':')) {
      var splitted = ip.split(':');
      if (splitted.length === 2) {
        return splitted[0];
      }
    }
    return ip;
  });
  for (var i = 0; i < forwardedIps.length; i++) {
    if (is.ip(forwardedIps[i])) {
      return forwardedIps[i];
    }
  }
  return null;
}
function getClientIpByHeader(req, header) {
  var _req$headers;
  if (!(req !== null && req !== void 0 && (_req$headers = req.headers) !== null && _req$headers !== void 0 && _req$headers[header])) return null;
  switch (header) {
    case 'x-client-ip':
      {
        if (is.ip(req.headers['x-client-ip'])) {
          return req.headers['x-client-ip'];
        }
        break;
      }
    case 'x-forwarded-for':
      {
        var xForwardedFor = getClientIpFromXForwardedFor(req.headers['x-forwarded-for']);
        if (is.ip(xForwardedFor)) {
          return xForwardedFor;
        }
        break;
      }
    case 'cf-connecting-ip':
      {
        if (is.ip(req.headers['cf-connecting-ip'])) {
          return req.headers['cf-connecting-ip'];
        }
        break;
      }
    case 'fastly-client-ip':
      {
        if (is.ip(req.headers['fastly-client-ip'])) {
          return req.headers['fastly-client-ip'];
        }
        break;
      }
    case 'true-client-ip':
      {
        if (is.ip(req.headers['true-client-ip'])) {
          return req.headers['true-client-ip'];
        }
        break;
      }
    case 'x-real-ip':
      {
        if (is.ip(req.headers['x-real-ip'])) {
          return req.headers['x-real-ip'];
        }
        break;
      }
    case 'x-cluster-client-ip':
      {
        if (is.ip(req.headers['x-cluster-client-ip'])) {
          return req.headers['x-cluster-client-ip'];
        }
        break;
      }
    case 'x-forwarded':
      {
        if (is.ip(req.headers['x-forwarded'])) {
          return req.headers['x-forwarded'];
        }
        break;
      }
    case 'forwarded-for':
      {
        if (is.ip(req.headers['forwarded-for'])) {
          return req.headers['forwarded-for'];
        }
        break;
      }
    case 'forwarded':
      {
        if (is.ip(req.headers['forwarded'])) {
          return req.headers['forwarded'];
        }
        break;
      }
    case 'x-appengine-user-ip':
      {
        if (is.ip(req.headers['x-appengine-user-ip'])) {
          return req.headers['x-appengine-user-ip'];
        }
        break;
      }
    default:
      {}
  }
  return null;
}
function getClientIp(req) {
  if (req.headers) {
    var _iterator = _createForOfIteratorHelper(headerPriorityList),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var header = _step.value;
        var value = getClientIpByHeader(req, header);
        if (value) return value;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  if (is.existy(req.connection)) {
    if (is.ip(req.connection.remoteAddress)) {
      return req.connection.remoteAddress;
    }
    if (is.existy(req.connection.socket) && is.ip(req.connection.socket.remoteAddress)) {
      return req.connection.socket.remoteAddress;
    }
  }
  if (is.existy(req.socket) && is.ip(req.socket.remoteAddress)) {
    return req.socket.remoteAddress;
  }
  if (is.existy(req.info) && is.ip(req.info.remoteAddress)) {
    return req.info.remoteAddress;
  }
  if (is.existy(req.requestContext) && is.existy(req.requestContext.identity) && is.ip(req.requestContext.identity.sourceIp)) {
    return req.requestContext.identity.sourceIp;
  }
  if (req.headers) {
    if (is.ip(req.headers['Cf-Pseudo-IPv4'])) {
      return req.headers['Cf-Pseudo-IPv4'];
    }
  }
  if (is.existy(req.raw)) {
    return getClientIp(req.raw);
  }
  return null;
}
function mw(options) {
  var _configuration$priori;
  var configuration = is.not.existy(options) ? {} : options;
  if (is.not.object(configuration)) {
    throw new TypeError('Options must be an object!');
  }
  if (configuration !== null && configuration !== void 0 && (_configuration$priori = configuration.prioritize) !== null && _configuration$priori !== void 0 && _configuration$priori.length) {
    if (configuration !== null && configuration !== void 0 && configuration.prioritize.find(function (item) {
      return typeof item !== 'string';
    })) {
      throw new TypeError('Prioritize list must be an array of string!');
    }
    var _iterator2 = _createForOfIteratorHelper(configuration.prioritize),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var prioritizedHeader = _step2.value;
        for (var i = 0; i < headerPriorityList.length; i++) {
          if (prioritizedHeader === headerPriorityList[i]) {
            headerPriorityList.splice(i, 1);
            break;
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    headerPriorityList.unshift.apply(headerPriorityList, _toConsumableArray(configuration.prioritize));
  }
  var attributeName = configuration.attributeName || 'clientIp';
  return function (req, res, next) {
    var ip = getClientIp(req);
    Object.defineProperty(req, attributeName, {
      get: function get() {
        return ip;
      },
      configurable: true
    });
    next();
  };
}
module.exports = {
  getClientIpFromXForwardedFor: getClientIpFromXForwardedFor,
  getClientIpByHeader: getClientIpByHeader,
  getClientIp: getClientIp,
  mw: mw
};