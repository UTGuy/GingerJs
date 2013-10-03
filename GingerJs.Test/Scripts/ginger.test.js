/// <reference path="../UnitTestSetup.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.mapping.js" />
(function(q, app, ko) {

    // Uncomment this to debug
    //q.moduleDone = function () {
    //};

    q.module("Ginger", {
        setup: function() {
        },
        teardown: function() {
        }
    });

    q.test("Unmapping an instance should not give an empty object", function() {
        var model = app.bindModel(function() {
            this.Id = ko.observable('');
        });

        var vm = new model();
        vm.Id(1);
        var json = ko.mapping.toJS(vm);

        q.equal(json.Id, 1);
    });

    q.test("View Model is instanceof MyClassModel", function() {

        function MyClassModel() {
            this.Id = ko.observable('');
        }

        var myClass = app.bindModel(MyClassModel);
        var vm = new myClass();

        q.equal(vm instanceof MyClassModel, true);
    });

})(QUnit, Ginger, ko);