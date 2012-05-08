/*----- LICENSE ------------------------------------------------------
 * Copyright (c) 2012 Krzysztof Antoszek <krzysztof (at) antoszek.net>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ---------------------------------------------------------------- */

/*jslint plusplus: true, maxerr: 50, indent: 4 */
/*global window: true, document: true*/

(function (window, document) {

    "use strict";

    /**
     * Internal object cache
     * @type {Object}
     */
    var defined = {},

        /**
         * Defines a list of namespaces to be loaded
         * @type {Array}
         */
        loading = [],

        /**
         * Defines a list of callbacks to be run
         * @type {Array}
         */
        waiting = [],

        /**
         * The head element of the page
         * @type {Node}
         */
        head = document.getElementsByTagName("head")[0],

        /**
         * Iterates through loading array and creates script tags to load
         * specified namespace paths. Dots in namespaces will be converted
         * to slashes, so a test1.test2.Object will be converted to
         * test1/test2/Object.js and that script will be loaded
         * @function
         */
        loadRequired = function () {
            var script,
                loadingCopy = loading.concat().reverse(),
                i = loading.length;

            while (--i >= 0) {
                script = document.createElement("script");
                script.src = [loadingCopy[i].replace(/\./gi, "/"), "js"].join(".");
                script.defer = true;
                script.async = true;
                head.appendChild(script);
                loadingCopy.splice(i, 1);
            }

            loading = loadingCopy.reverse();
        },

        /**
         * Loads supplied array of class namespace paths and passes the
         * results to callback
         * @function
         * @param {Array} namespaces
         * @param {Function} callback
         */
        require = function (namespaces, callback) {
            var i,
                imax = namespaces.length,
                reqsDefined = true,
                params = [];
            for (i = 0; i < imax; i++) {
                if (typeof defined[namespaces[i]] === "undefined") {
                    reqsDefined = false;
                    loading.push(namespaces[i]);
                } else {
                    params.push(defined[namespaces[i]]);
                }
            }

            if (reqsDefined === true) {
                callback.apply(null, params);
            } else {
                waiting.push([namespaces, callback]);
            }
            loadRequired();
        },

        /**
         * Runs through defined waiting array, checks if required namespa-
         * ces are loaded and runs the callbacks passing through required
         * namspaces
         * @function
         */
        checkWaiting = function () {
            var i = waiting.length,
                callback,
                params = [],
                reqsDefined,
                x,
                xmax;
            while (--i >= 0) {
                callback = waiting[i][1];
                params = [];
                reqsDefined = true;
                xmax = waiting[i][0].length;
                for (x = 0; x < xmax; x++) {
                    if (typeof defined[waiting[i][0][x]] === "undefined") {
                        reqsDefined = false;
                    } else {
                        params.push(defined[waiting[i][0][x]]);
                    }
                }
                if (reqsDefined === true) {
                    waiting.splice(i, 1);
                    callback.apply(null, params);
                }
            }
        },

        /**
         * Recursively creates objects in specified branch and assigns
         * value to the last leaf
         * @function
         * @param {Object} branch
         * @param {Array} leafPath
         * @param {*} value
         */
        createLeaf = function (branch, leafPath, value) {
            var leaf = leafPath.pop();
            if (leafPath.length > 0) {
                if (typeof branch[leaf] !== "undefined") {
                    if (typeof branch[leaf] !== "object"
                            || branch[leaf] === null) {
                        throw new Error("mamd.provide(): Cannot create leaf if namespace path part is not an object", [].concat(leafPath, leaf), typeof branch[leaf]);
                    }
                } else {
                    branch[leaf] = {};
                }
                createLeaf(branch[leaf], leafPath, value);
            } else {
                branch[leaf] = value;
            }
        },

        /**
         * Assigns specified value to namespace in the internal object
         * cache and creates the namespace in window global object
         * @function
         * @param {string} namespace
         * @param {*} value
         */
        provide = function (namespace, value) {
            var path = namespace.split(".");
            defined[namespace] = value;
            createLeaf(window, path.reverse(), defined[namespace]);
        },

        /**
         * Defines a namespace and assigns the result of the factory
         * function to it. If required namespaces are specified, then
         * they will be loaded first and passed to factory function as
         * parameters
         * @function
         * @param {string} namespace
         * @param {=Array} requirements [OPTIONAL]
         * @param {Function} factory
         */
        define = function () {
            var args = Array.prototype.slice.call(arguments),
                fc,
                reqs,
                nm;
            if (args.length <= 1) {
                throw new Error("mamd.define(): must have at least 2 parameters, name and factory");
            }

            fc = args.pop();
            reqs = args.length === 2 ? args.pop() : [];
            nm = args.pop();

            if (reqs.length > 0) {
                require(reqs, function () {
                    provide(nm, fc.apply(null, arguments));
                });
            } else {
                provide(nm, fc.apply(null));
            }

            checkWaiting();
        },

        /**
         * The mamd object
         * @type {Object}
         */
        mamd = {
            "require": require,
            "define": define,
            "provide": provide
        };

    if (typeof window.mamd === "undefined") {
        window.mamd = mamd;
    } else {
        window.$mamd = mamd;
    }
}(window, document));
