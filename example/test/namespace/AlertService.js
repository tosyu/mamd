mamd.define("test.namespace.AlertService", function () {
    var AlertService = function (message) {
        this.message = message;
    };
    AlertService.prototype = {
        'show': function () {
            alert(this.message);
        }
    };

    return AlertService;
});
