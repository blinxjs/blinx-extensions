"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (module) {
    var $ = (0, _observa2.default)({
        _: {}
    });

    // Observable proxy setup
    module.__observerFns = [];
    module.observe_For && module.observe_For.forEach(function (fnName) {
        if (!module[fnName] || typeof module[fnName] !== "function") {
            console.error("{fnName} is not available over module. Can be observed.");
            return;
        }
        var fnObj = {
            fn: module[fnName],
            deps: "*"
        };

        module.__observerFns.push(fnObj);
    });

    $.onChange = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        console.log("Onchange called....");
        console.log(arguments);
        _callObservingMethods.call.apply(_callObservingMethods, [module].concat(args));
    };

    return {
        _: $._
    };
};

var _observa = require("observa");

var _observa2 = _interopRequireDefault(_observa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _callObservingMethods = function _callObservingMethods() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var ctx = this;

    setTimeout(function () {
        ctx.__observerFns.forEach(function (fnObj) {
            if (Array.isArray(fnObj.deps)) {
                (function () {

                    // Dont trigger if adjacent node/sibling node has changed
                    var pathArray = path.split("=");
                    var depsMatched = fnObj.deps.find(function (deps) {
                        var depsArr = deps.split(".");

                        if (isEqual(depsArr, pathArray)) return true;

                        if (pathArray.length < depsArr.length) {
                            var pathLastIndex = pathArray.length - 1;

                            if (isEqual(pathArray[pathLastIndex], depsArr[pathLastIndex])) return true;
                        }

                        if (pathArray.length <= depsArr.length) {
                            return pathArray.find(function (keyItem, index) {
                                return depsArr[index] !== keyItem;
                            });
                        }
                    });

                    depsMatched ? fnObj.fn.call(ctx) : undefined;
                })();
            } else {
                var _fnObj$fn;

                (_fnObj$fn = fnObj.fn).call.apply(_fnObj$fn, [ctx].concat(args));
            }
        });
    });
};

;