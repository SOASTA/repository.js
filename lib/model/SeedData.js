"use strict";

var log = require("../util/log");
var apiJson = require("../util/api-json");
var apiStream = require("../util/api-stream");
var csv = require("../util/csv");

/**
 * @class SeedData
 * @desc
 * SeedData is a blob of data corresponding to an [Object]{@link Objects} in the repository database.
 * Use this class to interact with SeedData
 */

/**
 * @constructor SeedData
 *
 * @param {string} serviceUrl - API endpoint URL
 */
function SeedData(serviceUrl) {
    this.endpoint = serviceUrl + "/SeedData";
}

/**
 * Reads the content of the specified SeedData object from the repository with the ID passed in and returns it
 * in the callback passed in
 *
 * @param {string} token - API-Auth token retrieved witrh {@link Tokens}
 * @param {string} id - Repository ID of the SeedData object
 * @param {function} callback -
 * [Called after the API request was finalized]{@link SeedData~readSeedData(callback)}
 */
SeedData.prototype.readSeedData = function(token, id, callback) {
    log.debug("readSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiJson(token, seedDataURL, "GET", null, callback);
};
/**
 * @callback SeedData~readSeedData(callback)
 *
 * @param {?(APIError|Error)} err - {@link null} or an Error object returned by the request
 * @param {?(string|Object)} responseBody - the SeedData rows in CSV form
 */

/**
 * Read data from the given SeedData object in the database as a stream
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the SeedData Object
 * @param {stream.Readable} outStream - a {@link StreamReader} that will consume the opened HTTP connection
 * sending the SeedData down to the client
 * @param {function} callback -
 * [Called after the API request was finalized]{@link SeedData~readSeedDataStream(callback)}
 */
SeedData.prototype.readSeedDataStream = function(token, id, outStream, callback) {
    log.debug("readSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiStream(token, seedDataURL, "GET", null, outStream, callback);
};
/**
 * @callback SeedData~readSeedDataStream(callback) callback
 *
 * @param {?(APIError|Error)} err - {@link null} or an objecrt describing an exception that occured during execution
 */

/**
 * Append data to the given SeedData object in the database
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the Repository Object
 * @param {(string|string[])} content - Content to be appended to the SeedData object, in CSV form or array of strings
 * @param {function} callback -
 * [Called after the API request was finalized]{@link SeedData~appendSeedData(callback)}
 */
SeedData.prototype.appendSeedData = function(token, id, content, callback) {
    log.debug("appendSeedData(token=" + token + ", id=" + id + ", content=" + content + ")");

    var seedDataURL = this.getSeedDataURL(id);
    csv.toCSV(content, function(err, data) {
        if (err) {
            callback(err);
            return;
        }

        apiJson(token, seedDataURL, "POST", data, callback);
    });
};
/**
 * @callback SeedData~appendSeedData(callback) callback
 *
 * @param {?(APIError|Error)} err - {@link null} or an objecrt describing an exception that occured during execution
 * @param {?string} responseBody - Empty String
 */

/**
 * Append data to the given SeedData object in the database as a stream
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the SeedData Object
 * @param {StreamWriter} inStream - a {@link StreamWriter} that will write to the opened HTTP connection sending
 * the appended SeedData
 * @param {function} callback -
 * [Called after the API request was finalized]{@link SeedData~appendSeedDataStream(callback)}
 */
SeedData.prototype.appendSeedDataStream = function(token, id, inStream, callback) {
    log.debug("appendSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiStream(token, seedDataURL, "POST", inStream, null, callback);
};
/**
 * @callback SeedData~appendSeedDataStream(callback) callback
 *
 * @param {?(APIError|Error)} err - {@link null} or an objecrt describing an exception that occured during execution
 */

/**
 * Truncate the given SeedData Object matching the id in the repository database
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the Repository Object
 * @param {function} callback -
 * [Called after the API request was finalized]{@link SeedData~truncateSeedData(callback)}
 */
SeedData.prototype.truncateSeedData = function(token, id, callback) {
    log.debug("truncateSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiStream(token, seedDataURL, "DELETE", null, null, callback);
};
/**
 * @callback SeedData~truncateSeedData(callback) callback
 *
 * @param {?(APIError|Error)} err - {@link null} or an objecrt describing an exception that occured during execution
 * @param {?string} responseBody - Empty String
 */

/**
 * Build the data URL for a SeedData element in the repository
 *
 * @param {string} id - The ID of the SeedData in the Repository database
 *
 * @returns {string} The URL of the SeedData
 */
SeedData.prototype.getSeedDataURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = SeedData;
