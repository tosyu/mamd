mamd.define("test.namespace.HelloWorld", ["test.namespace.AlertService"], function (service) {
    var s = new service("Hello World");

    return {
        "sayHello": function () {
            s.show();
        }
    };
});
