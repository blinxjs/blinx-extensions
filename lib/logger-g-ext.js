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
            _overrideFn(eventName);
            console.info("%cLifecycle" + ("%c " + this.moduleName) + ("%c status has changed to: " + eventName), "background:#006d5b; color: white", "background: #eee; color: #bada55, font-weight:bold", "font-weight:normal");
        }
    };
};

;