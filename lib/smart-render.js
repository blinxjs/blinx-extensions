"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (module) {
    if (!module.config || !module.config.enableSmartRender) return {};

    var renderFn = function renderFn(eventName) {

        var placeholder = this._;

        if (this.config.smartRenderModelKey) {
            placeholder = this._[this.config.smartRenderModelKey];
        }

        var parentNode = document.querySelector("#" + this.getUniqueId());
        var hasChild = parentNode.firstChild;

        if (!hasChild) {
            parentNode.innerHTML = "<div></div>";
            hasChild = parentNode.firstChild;
        }

        (0, _setDom2.default)(hasChild, this.template(placeholder));
    };

    return {

        render: renderFn
    };
};

var _setDom = require("set-dom");

var _setDom2 = _interopRequireDefault(_setDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }