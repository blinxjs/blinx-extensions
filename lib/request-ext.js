"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _utilsExt = require("./utils-ext");

var _utilsExt2 = _interopRequireDefault(_utilsExt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configuration;

function prepareRequest(config) {
    var promise = new Promise(function (resolve, reject) {

        function resolveRequest(data) {
            completed = true;
            resolve(data);
        }

        function rejectRequest(error) {
            completed = true;
            reject(error);
        }

        var params = {
            url: config.url,
            method: config.method || "GET",
            dataType: config.dataType || "json",
            data: config.params || {},
            headers: config.headers || {},
            processData: config.processData,
            contentType: config.contentType || false
        },
            handlers = {
            success: function success(data, textStatus, jqXhr) {
                if (configuration && configuration.success) {
                    configuration.success({
                        statusCode: jqXhr.status,
                        response: data,
                        resolve: resolveRequest,
                        reject: rejectRequest
                    });
                }
                resolve(data);
            },
            error: function error(jqXhr) {
                if (configuration && configuration.error) {
                    configuration.error({
                        statusCode: jqXhr.status,
                        response: jqXhr.responseJSON || jqXhr.responseText,
                        resolve: resolveRequest,
                        reject: rejectRequest
                    });
                }
                reject(jqXhr.responseJSON || jqXhr.responseText);
            },
            complete: function complete(jqXhr) {
                if (configuration && configuration.complete) {
                    configuration.complete({
                        statusCode: jqXhr.status,
                        response: jqXhr.responseJSON || jqXhr.responseText,
                        resolve: resolveRequest,
                        reject: rejectRequest
                    });
                }
                config.canceller && config.canceller.resolve();
            }
        },
            completed = false,
            xhr;

        if (configuration && configuration.start) {
            configuration.start({
                params: params,
                resolve: resolveRequest,
                reject: rejectRequest
            });
        }

        if (params.contentType && params.contentType.indexOf('application/json') > -1) {
            try {
                params.data = JSON.stringify(params.data);
            } catch (e) {
                console.error("contentType for ajax call set to application/json but the content is not json");
            }
        }

        if (!completed) {
            xhr = _jquery2.default.ajax(_utilsExt2.default.extend(params, handlers));
            if (config.canceller) {
                config.canceller.promise.then(function () {}, function () {
                    xhr.abort();
                });
            }
        } else {
            config.canceller && config.canceller.resolve();
        }
    });

    return promise;
}

function getJSON(url, params, options) {
    options = options || {};
    options = _utilsExt2.default.extend(options, {
        url: url,
        method: "GET",
        params: params
    });
    return prepareRequest(options);
}

function postJSON(url, params, options) {
    options = options || {};
    options = _utilsExt2.default.extend(options, {
        url: url,
        method: "POST",
        contentType: "application/json",
        params: params
    });
    return prepareRequest(options);
}

function postMultipart(url, params, options) {
    options = options || {};
    options = _utilsExt2.default.extend(options, {
        url: url,
        method: "POST",
        contentType: false,
        params: params
    });
    return prepareRequest(options);
}

function putJSON(url, params, options) {
    options = options || {};
    options = _utilsExt2.default.extend(options, {
        url: url,
        method: "PUT",
        params: params
    });
    return prepareRequest(options);
}

function deleteJSON(url, params, options) {
    options = options || {};
    options = _utilsExt2.default.extend(options, {
        url: url,
        method: "DELETE",
        params: params
    });
    return prepareRequest(options);
}

function ajax(config) {
    return prepareRequest(config);
}

function getQueryStringForObject(o) {
    if (o) {
        return _jquery2.default.param(o);
    } else {
        return '';
    }
}

function configure(config) {
    configuration = config;
}

exports.default = {
    getJSON: getJSON,
    postJSON: postJSON,
    ajax: ajax,
    putJSON: putJSON,
    deleteJSON: deleteJSON,
    postMultipart: postMultipart,
    getQueryStringForObject: getQueryStringForObject,
    configure: configure
};