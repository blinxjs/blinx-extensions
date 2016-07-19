"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (module) {
    var _overrideFn = new Function();

    if (module.onStatusChange) {
        _overrideFn = module.onStatusChange.bind(module);
    }

    return {

        onStatusChange: function onStatusChange(eventName) {
            var _this = this;

            _overrideFn(eventName);

            var onRender = eventName === "LIFECYCLE:ON_RENDER_CALLED";
            if (!onRender) return;

            var configPresent = Boolean(this.config);
            if (!configPresent) return;

            var domEventConfigPresent = Boolean(this.config.domEvents);
            if (!domEventConfigPresent) return;

            var self = this;
            _utilsExt2.default.each(this.config.domEvents, function (evtDetail, key) {
                _utilsExt2.default.each(evtDetail, function (val) {
                    var selectors = void 0,
                        publishFn = void 0;

                    publishFn = function publishFn(e) {
                        var target = $(e.currentTarget);
                        var publishData = {};

                        if (val.extract) {
                            _utilsExt2.default.each(val.extract, function (eventType, key) {
                                var fn = eventType.split("#");
                                if (fn.length === 2) {
                                    publishData[key] = target[fn[0]](fn[1]);
                                } else if (fn.length === 1) {
                                    publishData[key] = target[fn[0]]();
                                }
                            });
                        }

                        // If key press needs to be handled
                        if (val.which) {
                            if (val.which.indexOf(e.which) > -1) {
                                self[val.callback](publishData);
                            }
                        } else {
                            self[val.callback](publishData);
                        }
                    };

                    // Id selector is not present, binf on conatiner
                    if (val.selectors) {
                        selectors = val.selectors.join(",");
                    }

                    if (!selectors) {
                        $(_this.getModuleContainer()).on(key, publishFn);
                    } else {
                        $(_this.getModuleContainer()).on(key, selectors, publishFn);
                    }
                });
            });
        }
    };
};

var _domExt = require("./dom-ext");

var _domExt2 = _interopRequireDefault(_domExt);

var _utilsExt = require("./utils-ext");

var _utilsExt2 = _interopRequireDefault(_utilsExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = _domExt2.default.getDomNode;