"use strict";

var log = require("./log");
var APIError = require("../errors/APIError.js");

var url = require("url");
var http = require("http");
var https = require("https");

/**
 * @namespace Util
 * @function api
 *
 * @desc
 * Wrapper function querying the API via HTTP and parsing the response to a JSON object
 *
 * @param {string} token - API-Auth token
 * @param {string} endpoint - URL to the API endpoint
 * @param {string} method - HTTP Method use with the API call
 * @param {?string} requestBody - A string of HTTP request body content if we choose to POST to the API
 * @param {function} callback -
 * [A callback called after the API request was finalized]{@link api~api(callback)}
 */
function api(token, endpoint, method, requestBody, callback) {
    log.debug("sendRequest(endpoint=" + endpoint + ", method=" + method + ", requestBody=" + requestBody + ")");

    if (typeof requestBody === "object") {
        requestBody = JSON.stringify(requestBody);
        log.debug("Serialized requestBody to: " + requestBody);
    }

    var headers = {
        "Connection": "close"
    };

    if (requestBody) {
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = requestBody.length;
    }

    if (token) {
        headers["X-Auth-Token"] = token;
    }

    var options = url.parse(endpoint);
    options.method = method;
    options.headers = headers;

    var protocol = options.protocol === "http:" ? http : https;

    var responseBody = "";

    var req = protocol.request(options, function(response) {
        response.on("data", function(chunk) {
            responseBody += chunk;
        });

        response.on("end", function() {
            var responseCode = response.statusCode;
            log.debug("Got response code: " + responseCode + ", response body: " + responseBody);

            if (callback) {
                if (responseBody.trim().length === 0) {
                    responseBody = null;
                } else {
                    try {
                        responseBody = JSON.parse(responseBody);
                    }
                    catch(exception) {
                        if (exception instanceof SyntaxError) {
                            // if it isn't a SyntaxError because the response was CSV (SeedData)
                            // do the callback with the Exception. Otherwise move on and handle response
                            if (!exception.message.match(/^Unexpected token ,$/).hasOwnProperty("length")) {
                                callback(exception, null);
                                return;
                            }
                        }
                    }
                }

                // Consider anything in the 200-299 range to be success.
                if (responseCode < 200 || responseCode >= 300) {
                    // Request failed.
                    var error = new APIError(response.statusMessage, responseBody, responseCode);
                    callback(error, null);
                    return;
                }

                callback(null, responseBody);
            }
        });

        response.on("error", function(error) {
            callback && callback(error);
        });
    });

    req.on("error", function(error) {
        callback && callback(error);
    });

    req.end(requestBody);
}
/**
 * @callback api~api(callback)
 * @param {?(APIError|Error)} err - {@link null} or an object describing an exception that occured during execution
 * @param {?(Object|string)} response - depending on the call different return types refer to the interacting
 * classes documented under {@link Repository}
 */

module.exports = api;
