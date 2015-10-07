"use strict";

var csvStringify = require("csv-stringify");

/**
 * @module CSV
 * @memberof Util
 * @desc
 * Utility funcitons handling CSV data and Arrays
 */

/**
 * @function isArray
 *
 * @desc
 * Test if the passed in argument is an array or not
 *
 * @param {} object - Argument tested for being an Array or not
 *
 * @returns {boolean} - true if the argument to the function is an Array
 */
exports.isArray = function(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
};

/**
 * @namespace csv
 * @function is2D
 *
 * @desc
 * Test if the elements in an already identified array are also an arrays
 *
 * _NOTE:_ This will also fail if only one element is also an array but the rest are singular values!
 *
 * @param {Object[]} array - An array to test for being a two dimensional array
 *
 * @returns {boolean} - true if the array is two dimensional
 */
exports.is2D = function(array) {
    return array.filter(function(element) { return !exports.isArray(element) }).length === 0;
};

/**
 * @namespace csv
 * @function toCSV
 *
 * @desc
 * Turn content into CSV formatted string
 * Uses {@link csv~is2D} and {@link csv~isArray} to test if the first argument is in the proper format
 * otherwise will simply return the content of the first argument, trusting that it is CSV
 *
 * @param {} content - Any type of object or array that can be turned into a 2D array for processing
 * @param {function} callback -
 * [Called once stringify has happend or it was determined not to be an array]{@link csv~toCSV(callback)}
 */
exports.toCSV = function(content, callback) {
    if(exports.isArray(content)) {
        if (!exports.is2D(content)) {
            content = [content];
        }
        csvStringify(content, function(err, csv) {
            callback(err, csv);
        });
    } else {
        callback(null, content);
    }
}
/**
 * @callback csv~toCSV(callback) callback
 *
 * @param {?Error} error - {@link null} or an Error object describing the error that occured
 * @param {?string} csvString - {@link null} in Error case or CSV formatted string of data
 */
