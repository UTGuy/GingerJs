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

    q.test("View Model is instanceof MySubClassModel", function() {

        function MySubClassModel() {
            this.Id = ko.observable('');
        }

        var mySubClass = app.bindModel(MySubClassModel);

        function MyClassModel() {
            this.Name = ko.observable('');
        }

        var myClass = app.bindModelWithBase(MyClassModel, mySubClass);
        var vm = new myClass();

        q.equal(vm instanceof MySubClassModel, true);
    });

    q.test("2 Different Models in a Map", function() {

        function ParentModel() {
            this.Child1 = ko.observable();
            this.Child2 = ko.observable();
        }

        function FirstSubModel() {
            this.Ida = ko.observable();
        }

        function SecondSubModel() {
            this.Idb = ko.observable();
        }

        var firstSub = app.bindModel(FirstSubModel);
        var secondSub = app.bindModel(SecondSubModel);

        function parentMap() {
            return new app.Map({
                "Child1": firstSub,
                "Child2": secondSub
            });
        }

        var parent = app.bindModel(ParentModel, parentMap);
        var vm = new parent({
            "Child1": {},
            "Child2": {}
        });

        var child1 = vm.Child1();
        var child2 = vm.Child2();

        q.equal(typeof child1 != "undefined", true);
        q.equal(typeof child2 != "undefined", true);

        var id1 = (null == child1) ? null : child1.Ida();
        var id2 = (null == child2) ? null : child2.Idb();
        q.equal(typeof id1 == "undefined", true);
        q.equal(typeof id2 == "undefined", true);
    });

})(QUnit, Ginger, ko);