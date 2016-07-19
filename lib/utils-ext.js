"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _domExt = require("./dom-ext");

var _domExt2 = _interopRequireDefault(_domExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseSingleDigit(localValue, suffix) {
    var num = localValue.substr(0, 2) + suffix;

    return num.slice(0, 1) + (parseInt(num.slice(1, 2)) ? '.' + num.slice(1, num.length) : num.slice(2, num.length));
}

function parseDoubleDigit(localValue, suffix) {
    var num = localValue.substr(0, 3) + suffix;

    return num.slice(0, 2) + (parseInt(num.slice(2, 3)) ? '.' + num.slice(2, num.length) : num.slice(3, num.length));
}

var utils = {
    isEmpty: _lodash2.default.isEmpty,
    after: _lodash2.default.after,
    get: _lodash2.default.get,
    find: _lodash2.default.find,
    debounce: _lodash2.default.debounce,
    filter: _lodash2.default.filter,
    flatten: _lodash2.default.flatten,
    union: _lodash2.default.union,
    groupBy: _lodash2.default.groupBy,
    reject: _lodash2.default.reject,
    each: _lodash2.default.each,
    pick: _lodash2.default.pick,
    map: _lodash2.default.map,
    throttle: _lodash2.default.throttle,
    pluck: _lodash2.default.pluck,
    reduce: _lodash2.default.reduce,
    zipObject: _lodash2.default.zipObject,
    findIndex: _lodash2.default.findIndex,
    indexOf: _lodash2.default.indexOf,
    contains: _lodash2.default.contains,
    curryRight: _lodash2.default.curryRight,
    object: _lodash2.default.object,
    values: _lodash2.default.values,
    length: _lodash2.default.size,
    assign: _lodash2.default.assign,
    compact: _lodash2.default.compact,
    uniq: _lodash2.default.uniq,
    clone: _lodash2.default.clone,
    cloneDeep: _lodash2.default.cloneDeep,
    remove: _lodash2.default.remove,
    difference: _lodash2.default.difference,
    extend: _lodash2.default.extend,
    merge: _lodash2.default.merge,
    indexBy: _lodash2.default.indexBy,
    forEach: _lodash2.default.forEach,

    startsWith: function startsWith(needle, haystack) {
        var regEx,
            isStartsWith = false;

        if (!haystack || !needle) {
            return isStartsWith;
        }

        if (String.prototype.startsWith) {
            isStartsWith = haystack.startsWith(needle);
        } else {
            regEx = new RegExp('^' + needle);
            isStartsWith = regEx.test(haystack);
        }

        return isStartsWith;
    },

    endsWith: function endsWith(needle, haystack) {
        var regEx, isEndsWith;

        if (String.prototype.endsWith) {
            isEndsWith = haystack.endsWith(needle);
        } else {
            regEx = new RegExp(needle + "$");
            isEndsWith = regEx.test(haystack);
        }

        return isEndsWith;
    },

    stripHtmlTags: function stripHtmlTags(html) {
        var divEl;

        if (!html) {
            return null;
        }

        divEl = document.createElement("div").innerHTML = html;
        return divEl.textContent || divEl.innerText || html.replace(/(<([^>]+)>)/ig, "");
    },

    clearSlashes: function clearSlashes(string) {
        return _lodash2.default.trim(string, "/");
    },

    isObject: function isObject(obj) {
        return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object";
    },

    isArray: function isArray(obj) {
        return _lodash2.default.isArray(obj);
    },

    isNumeric: function isNumeric(obj) {
        return !Array.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
    },

    isNumber: function isNumber() {
        throw new Error("notImplementedException");
    },

    isString: function isString(string) {
        return typeof string === "string" || string instanceof String;
    },

    isFunction: function isFunction(object) {
        return typeof object === "function";
    },

    isValidUrl: function isValidUrl(url) {
        return (/^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+)?(?::\d{1,5})?(?:[/?#]\S*)?$/i.test(url)
        );
    },

    loadScript: function loadScript(src, isAsync) {
        var scriptEl, firstScriptEl;

        return new Promise(function (resolve, reject) {
            scriptEl = document.createElement('script');
            scriptEl.type = 'text/javascript';
            scriptEl.async = isAsync || false;
            scriptEl.src = src;

            scriptEl.onload = scriptEl.onreadystatechange = function () {
                if (this.readyState && this.readyState != 'complete' && this.readyState != 'loaded') {
                    return;
                }

                resolve();
            };

            scriptEl.onerror = function () {
                reject();
            };

            firstScriptEl = document.getElementsByTagName('script')[0];
            firstScriptEl.parentNode.insertBefore(scriptEl, firstScriptEl);
        });
    },

    scrollTo: function scrollTo(target, options) {
        var targetEl = $(target),
            targetElOffset = targetEl.offset();

        _domExt2.default.getDomNode("#content-container").animate({
            scrollTop: targetElOffset.top - options.paddingTop
        }, options.duration, options.onComplete);
    },

    intersection: _lodash2.default.intersection,

    includesState: function includesState(needle, haystack) {
        var ishaveState = false;
        if (!haystack || !needle) {
            return ishaveState;
        }

        if (utils.startsWith(needle, haystack)) {
            if (haystack[needle.length] === '.' || haystack[needle.length] === undefined) {
                ishaveState = true;
            }
        }
        return ishaveState;
    },

    formatNumberIn: function formatNumberIn(value) {
        var formattedValue;
        value += '';

        switch (value.length) {
            case 4:
                formattedValue = parseSingleDigit(value, ' T');
                break;
            case 5:
                formattedValue = parseDoubleDigit(value, ' T');
                break;
            case 6:
                formattedValue = parseSingleDigit(value, ' L');
                break;
            case 7:
                formattedValue = parseDoubleDigit(value, ' L');
                break;
            case 8:
                formattedValue = parseSingleDigit(value, ' C');
                break;
            case 9:
                formattedValue = parseDoubleDigit(value, ' C');
                break;
            case 10:
                formattedValue = value.substr(0, 3) + ' C';
                break;
            default:
                formattedValue = value;
                break;
        }

        return formattedValue;
    },

    formatCurrency: function formatCurrency(value) {
        var afterPoint = '',
            lastThree,
            otherNumbers;

        if (isNaN(value)) {
            return value;
        }

        value = value.toString();

        if (value.indexOf('.') > 0) {
            afterPoint = value.substring(value.indexOf('.'), value.length);
        }
        value = Math.floor(value);
        value = value.toString();

        lastThree = value.substring(value.length - 3);
        otherNumbers = value.substring(0, value.length - 3);

        if (otherNumbers != '') {
            lastThree = ',' + lastThree;
        }
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    },

    isVisibleInContainer: function isVisibleInContainer(domNode, containerNode, boundaryConditions) {
        var isVisibleInContainer = false,
            containerNode = containerNode || _domExt2.default.getDomNode("body"),
            domNodeBoundingClientRect = domNode.getBoundingClientRect(),
            containerNodeBoundingClientRect = containerNode.getBoundingClientRect(),
            boundaryConditions = boundaryConditions || {
            top: true,
            bottom: true
        };

        if (boundaryConditions.top) {
            isVisibleInContainer = domNodeBoundingClientRect.top >= containerNodeBoundingClientRect.top;
        }

        if (boundaryConditions.bottom) {
            isVisibleInContainer = domNodeBoundingClientRect.bottom <= containerNodeBoundingClientRect.bottom;
        }

        return isVisibleInContainer;
    },

    capitalize: function capitalize(strn) {
        if (strn) {
            var str = strn.toLowerCase();
            var newStrArr = str.split('_'),
                newStr = "";
            var isUnderscorePresent = str.indexOf('_') > -1;
            for (var i = 0; i < newStrArr.length; i++) {
                newStr += newStrArr[i].charAt(0).toUpperCase() + newStrArr[i].substring(1) + (isUnderscorePresent ? ' ' : '');
            }

            return newStr;
        } else {
            return "";
        }
    }
};

exports.default = {
    find: utils.find,
    get: utils.get,
    debounce: utils.debounce,
    filter: utils.filter,
    after: utils.after,
    flatten: utils.flatten,
    union: utils.union,
    groupBy: utils.groupBy,
    reject: utils.reject,
    each: utils.each,
    pick: utils.pick,
    assign: utils.assign,
    compact: utils.compact,
    uniq: utils.uniq,
    clone: utils.clone,
    cloneDeep: utils.cloneDeep,
    remove: utils.remove,
    isEmpty: utils.isEmpty,
    difference: utils.difference,
    extend: utils.extend,
    merge: utils.merge,
    map: utils.map,
    startsWith: utils.startsWith,
    endsWith: utils.endsWith,
    stripHtmlTags: utils.stripHtmlTags,
    clearSlashes: utils.clearSlashes,
    loadScript: utils.loadScript,
    throttle: utils.throttle,
    pluck: utils.pluck,
    reduce: utils.reduce,
    zipObject: utils.zipObject,
    object: utils.object,
    values: utils.values,
    length: utils.length,
    isObject: utils.isObject,
    isArray: utils.isArray,
    isNumber: utils.isNumber,
    isString: utils.isString,
    isFunction: utils.isFunction,
    isValidUrl: utils.isValidUrl,
    findIndex: utils.findIndex,
    indexOf: utils.indexOf,
    contains: utils.contains,
    isNumeric: utils.isNumeric,
    curryRight: utils.curryRight,
    capitalize: utils.capitalize,
    intersection: _lodash2.default.intersection,
    scrollTo: utils.scrollTo,
    formatNumberIn: utils.formatNumberIn,
    formatCurrency: utils.formatCurrency,
    includesState: utils.includesState,
    isVisibleInContainer: utils.isVisibleInContainer,
    forEach: utils.forEach,
    indexBy: utils.indexBy
};