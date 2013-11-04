/// <reference path="../UnitTestSetup.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.mapping.js" />
(function(q, app, ko) {

    // Uncomment this to debug
    q.moduleDone = function () {
    };

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

    q.test("Base property 'Other' is instanceof OtherClassModel", function() {

        function OtherClassModel() {
            this.Id = ko.observable();
        }

        var otherClass = app.bindModel(OtherClassModel);

        function MyBaseClassModel() {
            this.Other = ko.observable();
        }

        function myBaseClassMap() {
            return new app.Map({
                "Other": otherClass
            });
        }

        var myBaseClass = app.bindModel(MyBaseClassModel, myBaseClassMap);

        function MyClassModel() {
            // No longer required as of 1.0.3
            // MyClassModel.base.apply(this, arguments);
        }

        var myClass = app.bindModelWithBase(MyClassModel, myBaseClass);

        var vm = new myClass({ Other: {} });
        q.equal(vm.Other() instanceof OtherClassModel, true);
    });

    q.test("Unmapping test", function() {

        function MyClassModel() {
            this.ObjectValue = ko.observable();
            this.ArrayValue = ko.observableArray();
            this.ComputedValue = ko.computed(function() {
                return "foo";
            });
            this.FunctionValue = function() {
                return "bar";
            };
        }

        var myClass = app.bindModel(MyClassModel);
        var vm = new myClass();
        var json = ko.mapping.toJS(vm);
        q.equal(typeof json.__ko_mapping__, "undefined", "__ko_mapping__ should be undefined");
        q.equal(json.ObjectValue, undefined, "ObjectValue should be null");
        q.equal(json.ArrayValue.length, 0, "ArrayValue should be and empty array");
        q.equal(json.ComputedValue, "foo", "ComputedValue should be foo");
        q.equal(typeof json.FunctionValue, "undefined", "FunctionValue should be undefined");

    });

    q.test("Load test", function() {

        function MyClassModel() {
            var self = this;
            this.Name = ko.observable('');
            this.load = function() {
                self.Name("foo");
            };
        }

        var myClass = app.bindModel(MyClassModel);
        var vm = new myClass();
        q.equal(vm.Name(), "foo");
    });

})(QUnit, Ginger, ko);