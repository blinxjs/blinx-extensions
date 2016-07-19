'use strict';

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

            var onRender = eventName === "LIFECYCLE:RESOLVE_RENDER_ON_CALLED";
            if (!onRender) return;

            var configPresent = Boolean(this.config);
            if (!configPresent) return;

            var reduxConfigPresent = Boolean(this.config.reduxConfig);
            if (!reduxConfigPresent) return;

            if (!this.reducers) return;
            this.render = new Function();

            this.store = (0, _redux.createStore)((0, _redux.combineReducers)(this.reducers), this.config.reduxConfig.store, window.devToolsExtension ? window.devToolsExtension() : undefined);
            this.containerNodeCache = undefined;
            $(this.getModuleContainer()).setHtml("<div></div>");
            this.store.subscribe(render.bind(this));

            var self = this;
            _utilsExt2.default.each(this.config.reduxConfig.events, function (evtDetail, key) {
                _utilsExt2.default.each(evtDetail, function (val) {
                    var selectors = void 0,
                        publishFn = void 0;

                    publishFn = function publishFn(e) {
                        var target = $(e.currentTarget);
                        var publishData = {
                            type: val.type
                        };

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
                                self.store.dispatch(publishData);
                            }
                        } else if (val.notWhich) {
                            if (val.notWhich.indexOf(e.which) < 0) {
                                self.store.dispatch(publishData);
                            }
                        } else {
                            self.store.dispatch(publishData);
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

            render.call(this);
        }
    };
};

var _redux = require('redux');

var _virtualDom = require('virtual-dom');

var _vdomParser = require('vdom-parser');

var _vdomParser2 = _interopRequireDefault(_vdomParser);

var _domExt = require('./dom-ext');

var _domExt2 = _interopRequireDefault(_domExt);

var _utilsExt = require('./utils-ext');

var _utilsExt2 = _interopRequireDefault(_utilsExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = _domExt2.default.getDomNode;

var render = function render() {

    var patcher = function patcher() {
        this.containerNodeCache = this.containerNodeCache || document.querySelector(this.getModuleContainer() + " div");

        var containerCache = (0, _vdomParser2.default)(this.containerNodeCache),
            nodeCache = (0, _vdomParser2.default)(this.template(this.store.getState())),
            patches = (0, _virtualDom.diff)(containerCache, nodeCache);

        this.containerNodeCache = (0, _virtualDom.patch)(this.containerNodeCache, patches);
    };

    patcher = patcher.bind(this);
    window.requestAnimationFrame(function () {
        patcher();
    });
};