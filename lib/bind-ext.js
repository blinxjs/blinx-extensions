"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (module) {
    var _overrideFn = new Function();

    if (module.__onStatusChange) {
        _overrideFn = module.__onStatusChange.bind(module);
    }

    return {

        __onStatusChange: function __onStatusChange(eventName) {
            var _this = this;

            _overrideFn(eventName);

            var onRender = eventName === "LIFECYCLE:ON_RENDER_CALLED";
            if (!onRender) return;

            var configPresent = Boolean(this.config);
            if (!configPresent) return;

            var domEventConfigPresent = Boolean(this.config.domEvents);
            if (!domEventConfigPresent) return;

            var self = this;

            var _loop = function _loop(key) {
                var evtDetail = _this.config.domEvents[key];
                evtDetail.forEach(function (val) {
                    var selectors = void 0,
                        publishFn = void 0;

                    publishFn = function publishFn(e) {
                        var target = $(e.currentTarget);
                        var publishData = {};

                        if (val.extract) {
                            for (var eKey in val.extract) {
                                var eventType = val.extract[eKey];
                                if (eventType === "event") {
                                    publishData[eKey] = e;
                                } else {
                                    var fn = eventType.split("#");
                                    if (fn.length === 2) {
                                        publishData[eKey] = target[fn[0]](fn[1]);
                                    } else if (fn.length === 1) {
                                        publishData[eKey] = target[fn[0]]();
                                    }
                                }
                            }
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
            };

            for (var key in this.config.domEvents) {
                _loop(key);
            }
        }
    };
};

var _domExt = require("./dom-ext");

var _domExt2 = _interopRequireDefault(_domExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = _domExt2.default.getDomNode;