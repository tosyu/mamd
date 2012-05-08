(function (window, document, undefined) {

    var defined = {};
    var loading = [];
    var waiting = [];
    var head = document.getElementsByTagName("head")[0];

    var loadRequired = function () {
        var i = 0,
            imax = loading.length,
            script;
        for (; i < imax; i++) {
            script = document.createElement('script');
            script.src = [loading[i].replace(/\./gi, "/"), 'js'].join('.');
            script.defer = true;
            script.async = true;
            head.appendChild(script);
            loading.splice(i, 1);
        }
    };

    var require = function (classPaths, callback) {
        var i = 0,
            imax = classPaths.length,
            reqsDefined = true,
            params = [];
        for (; i < imax; i++) {
            if (!(classPaths[i] in defined)) {
                reqsDefined = false;
                loading.push(classPaths[i]);
            } else {
                params.push(defined[classPaths[i]]);
            }
        }

        if (reqsDefined === true) {
            callback.apply(null, params);
        } else {
            waiting.push([classPaths, callback]);
        }
        loadRequired();
    };

    var checkWaiting = function () {
        var i = waiting.length;
        while (--i >= 0) {
            var callback = waiting[i][1],
                params = [],
                reqsDefined = true,
                x = 0,
                xmax = waiting[i][0].length;
            for (; x < xmax; x++) {
                if (!(waiting[i][0][x] in defined)) {
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
    };

    var createLeaf = function (branch, leafPath, value) {
        var leaf = leafPath.pop();
        if (leafPath.length > 0) {
            if (leaf in branch) {
                if (typeof branch[leaf] !== 'object'
                        || branch[leaf] === null) {
                    throw new Error("Cannot create leaf if namespace path part is not an object", [].concat(leafPath, leaf), typeof branch[leaf]);
                }
            } else {
                branch[leaf] = {};
            }
            createLeaf(branch[leaf], leafPath, value);
        } else {
            branch[leaf] = value;
        }
    }

    var provide = function (namespace, value) {
        var path = namespace.split('.');
        defined[namespace] = value;
        createLeaf(window, path.reverse(), defined[namespace]);
    };

    var define = function (name, requirements, factory) {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 0) {
            throw new Error("t.define() must have at least 2 parameters, name and factory");
        }

        var fc = args.pop(),
            reqs = args.length === 2 ? args.pop() : [],
            nm = args.pop();

        if (reqs.length > 0) {
            require(reqs, function () {
                provide(nm, fc.apply(null, arguments));
            });
        } else {
            provide(nm, fc.apply(null));
        }

        checkWaiting();
    };

    window.mamd = {
        "require": require,
        "define": define,
        "provide": provide
    };
})(window, document);