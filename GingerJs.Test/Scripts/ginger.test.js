﻿/// <reference path="../UnitTestSetup.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.mapping.js" />
(function(q, app, ko) {

    // Uncomment this to debug
    q.moduleDone = function() {
    };

    q.module("Ginger", {
        setup: function() {
            app.settings({
                includeComputed: false
            });
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

        var vm = new myClass({ Other: { Id: 1 } });

        var other = vm.Other();
        q.equal(other.Id(), 1);
        q.equal(other instanceof OtherClassModel, true);
    });

    q.test("Unmapping test", function() {

        app.settings({
            includeComputed: true
        });
        
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

    q.test("Base Load test", function() {

        function MySubClassModel() {
            var self = this;
            this.Id = ko.observable(0);
            this.load = function() {
                self.Id(1);
            };
        }

        var mySubClassModel = app.bindModel(MySubClassModel);

        function MyClassModel() {
            var self = this;
            this.Name = ko.observable('');
            this.load = function() {
                self.Name("foo");
            };
        }

        var myClass = app.bindModelWithBase(MyClassModel, mySubClassModel);
        var vm = new myClass();
        q.equal(vm.Name(), "foo");
        q.equal(vm.Id(), 1);
    });

    q.test("Base class data mapping", function() {

        function OtherClassModel() {
            this.Id = ko.observable();
        }

        var otherClass = app.bindModel(OtherClassModel);

        function MyBaseClassModel() {
            this.Name = ko.observable();
            this.Other = ko.observable(new otherClass());
        }

        function myBaseClassMap() {
            return new app.Map({
                "Other": otherClass
            });
        }

        var myBaseClass = app.bindModel(MyBaseClassModel, myBaseClassMap);

        function MyClassModel() {
        }

        var myClass = app.bindModelWithBase(MyClassModel, myBaseClass);

        var vm = new myClass({ Other: { Id: 1 } });
        q.equal(vm.Other().Id(), 1);

    });

    q.test("Sub-class mapping of base class property array", function() {

        function ComplexIdModel() {
            this.Id = ko.observable(999);
        }

        var complexId = app.bindModel(ComplexIdModel);

        function ComplexNameModel() {
            this.Name = ko.observable('abc');
        }

        var complexName = app.bindModel(ComplexNameModel);

        function SearchResultModel() {
            this.Items = ko.observableArray();
        }

        var searchResult = app.bindModel(SearchResultModel);

        function NameSearchResultItemModel() {
            this.IdValue = ko.observable(new complexId());
            this.NameValue = ko.observable(new complexName());
        }

        function NameSearchResultMap() {
            return new app.Map({
                "IdValue": complexId,
                "NameValue": complexName
            });
        }

        var nameSearchResultItem = app.bindModel(NameSearchResultItemModel, NameSearchResultMap);

        function NameSearchResultModel() {

        }

        function NameMap() {
            return new app.Map({
                "Items": nameSearchResultItem
            });
        }

        var nameSearchResult = app.bindModelWithBase(NameSearchResultModel, searchResult, NameMap);

        function ContainerModel() {
            this.SearchResult = ko.observable();
        }

        function ContainerMap() {
            return new app.Map({
                "SearchResult": nameSearchResult
            });
        }

        var container = app.bindModel(ContainerModel, ContainerMap);
        var vm = new container();
        var data = {
            Items: [
                { IdValue: { Id: 1 }, NameValue: { Name: 'foo' } },
                { IdValue: { Id: 2 }, NameValue: { Name: 'bar' } }
            ]
        };
        vm.SearchResult(new nameSearchResult(data));

        var items = vm.SearchResult().Items();
        q.equal(items.length, 2);

        var first = items[0];
        q.equal(first.IdValue().Id(), 1);
        q.equal(first.NameValue().Name(), "foo");

        var second = items[1];
        q.equal(second.IdValue().Id(), 2);
        q.equal(second.NameValue().Name(), "bar");
    });

    q.test("Deferred Computed properties do not get evaluated on auto include of properties", function() {

        function ContainerModel() {
            var self = this;
            this.Value = 0;
            this.ComputedValue = ko.computed(function() {
                self.Value++;
                return self.Value;
            }, null, { deferEvaluation: true });
        }

        var container = app.bindModel(ContainerModel);
        var vm = new container();
        q.equal(vm.Value, 0, "vm.Value should be false");
        q.equal(ko.isComputed(vm.ComputedValue), true);
    });

    q.test("ko.mapping.toJS for mapped properties with no data unmaps with defaults", function() {

        function MyDueDateModel() {
            this.Id = ko.observable(1);
        }

        var myDueDate = app.bindModel(MyDueDateModel);

        function ContainerModel() {
            this.Name = ko.observable('foo');
            this.DueDate = ko.observable(new myDueDate());
        }

        function ContainerMap() {
            return new app.Map({
                "DueDate": myDueDate
            });
        }

        var container = app.bindModel(ContainerModel, ContainerMap);
        var vm = new container();

        var json = ko.mapping.toJS(vm);
        q.equal(json.Name, "foo");
        q.equal(json.DueDate.Id, 1);
    });

    q.test("ko.mapping.toJS for mapped properties with data unmaps with data values", function() {

        function MyDueDateModel() {
            this.Id = ko.observable(1);
        }

        var myDueDate = app.bindModel(MyDueDateModel);

        function ContainerModel() {
            this.Name = ko.observable('foo');
            this.DueDate = ko.observable(new myDueDate());
            this.Computed = ko.computed(function() {
                return "foo";
            });
        }

        function ContainerMap() {
            return new app.Map({
                "DueDate": myDueDate
            });
        }

        var container = app.bindModel(ContainerModel, ContainerMap);
        var vm = new container({
            Name: "bar",
            DueDate: {
                Id: 2
            }
        });

        var json = ko.mapping.toJS(vm);
        q.equal(json.Name, "bar");
        q.equal(json.DueDate.Id, 2);
        q.equal(typeof json.Computed == "undefined", true);
    });

    q.test("2 classes inheriting from the same base should not have the same name", function() {

        function BaseClassModel() {
        }

        function ClassAModel() {
        }

        function ClassBModel() {
        }

        var baseClass = app.bindModel(BaseClassModel);
        var classA = app.bindModelWithBase(ClassAModel, baseClass);
        var classB = app.bindModelWithBase(ClassBModel, baseClass);

        var vmClassA = new classA();
        var vmClassB = new classB();

        q.equal(vmClassA instanceof ClassAModel, true);
        q.equal(vmClassB instanceof ClassBModel, true);

        q.equal(vmClassA instanceof BaseClassModel, true);
        q.equal(vmClassB instanceof BaseClassModel, true);
    });

    q.test("Unmap test", function() {

        var models = {};

        function Reference() {
            this.Id = ko.observable(0);
            this.Name = ko.observable('');

            var self = this;
            this.Name.subscribe(function(newValue) {
                if ((newValue || '').length == 0)
                    self.Id(0);
            });
            this.HasValue = ko.computed(function() {
                var id = self.Id() || "";
                return id.length > 0 && id > 0;
            });
        }

        models.Reference = app.bindModel(Reference);

        function ABObjectReference(da) {
            var self = this;
            this.searchAbObjects = function(query, process) {
                self.Id(0);
                da.searchAbObjects(query).success(function(data) {
                    process(data);
                });
                return true;
            };
            this.selectAbObject = function(item) {
                self.Id(item.Id);
                self.Name(item.Name);
                return item.Name;
            };
        }

        models.ABObjectReference = app.bindModelWithBase(ABObjectReference, models.Reference, null, function() {
            this.searchAbObjects = function(query) {
                return $.get("SearchAbObjects", query);
            };
        });

        function EventReference(da) {
            var self = this;
            self.searchEvents = function(query, process) {
                self.Id(0);
                da.searchEvents(query).success(function(data) {
                    process(data);
                });
                return true;
            };
            self.selectEvent = function(item) {
                self.Id(item.Id);
                self.Name(item.Name);
                return item.Name;
            };
        }

        models.EventReference = app.bindModelWithBase(EventReference, models.Reference, null, function() {
            this.searchEvents = function(query) {
                return $.get("SearchEvents", query);
            };
        });

        function CheckableItem() {
            this.IsChecked = ko.observable(false);
        }

        models.CheckableItem = app.bindModel(CheckableItem);

        function ScheduledPayment() {
            this.Id = ko.observable(0);
            this.DueDate = ko.observable(new Date());
            this.Client = ko.observable(new models.ABObjectReference());
            this.Contact = ko.observable(new models.ABObjectReference());
            this.Event = ko.observable(new models.EventReference());
            this.Amount = ko.observable(0.0);
            this.Allocated = ko.observable(0.0);
            this.Balance = ko.observable(0.0);
            this.Note = ko.observable('');
            this.CurrencyId = ko.observable(1);
            this.Currency = ko.observable({});
            this.IsPastDue = ko.observable(false);
        }

        function myMap() {
            return new app.Map({
                "Client": models.ABObjectReference,
                "Contact": models.ABObjectReference,
                "Event": models.EventReference
            });
        }

        models.ScheduledPayment = app.bindModelWithBase(ScheduledPayment, models.CheckableItem, myMap);

        function ScheduledPaymentEdit() {
            this.AllowClientEdit = ko.observable(false);
            this.AllowEventEdit = ko.observable(false);
            this.AllowCurrencyEdit = ko.observable(false);
            this.Note = ko.observable('');
            this.Title = ko.observable('ADD-EDIT-SCHEDULED-PAYMENT');
        }

        models.ScheduledPaymentEdit = app.bindModelWithBase(ScheduledPaymentEdit, models.ScheduledPayment);

        var vm = new models.ScheduledPaymentEdit();

        var koMapping = vm.__ko_mapping__;
        var list = "[" + koMapping.include.join("][") + "]";

        function contains(property) {
            q.equal(list.indexOf("[" + property + "]") > -1, true, property);
        }

        contains("Client");
        contains("Contact");
        contains("Event");
        contains("IsChecked");
        contains("Id");
        contains("DueDate");
        contains("Amount");
        contains("Allocated");
        contains("Balance");
        contains("Note");
        contains("CurrencyId");
        contains("Currency");
        contains("IsPastDue");
        contains("AllowClientEdit");
        contains("AllowEventEdit");
        contains("AllowCurrencyEdit");
        contains("Title");
        contains("_destroy");
    });

    q.test("Mapping data properties to read-only computeds should not overwrite the computed", function() {

        function ContainerModel() {

            this.ValueType = 1;
            this.Observed = ko.observable("abc");
            
            this.ReadOnlyComputed = ko.computed(function() {
                return "foo";
            });

            var value = ko.observable(1);
            this.WritableComputed = ko.computed({
                read: function() {
                    return value();
                },
                write: function(newValue) {
                    value(newValue);
                }
            });
        }

        var container = app.bindModel(ContainerModel);
        var vm = new container({
            NewValue: 999,
            ValueType: 2,
            Observed: "xyz",
            ReadOnlyComputed: "bar",
            WritableComputed: 2
        });

        q.equal(ko.isObservable(vm.NewValue), true);
        q.equal(ko.isObservable(vm.ValueType), false);
        q.equal(ko.isObservable(vm.Observed), true);
        q.equal(ko.isComputed(vm.ReadOnlyComputed), true);
        q.equal(ko.isComputed(vm.WritableComputed), true);

        q.equal(vm.NewValue(), 999, "Should be added as 999");
        q.equal(vm.ValueType, 2, "Should change to 2");
        q.equal(vm.Observed(), "xyz", "Should change to xyz");
        q.equal(vm.ReadOnlyComputed(), "foo", "Should remain as 'foo'");
        q.equal(vm.WritableComputed(), 2, "Should change to 2");

    });

})(QUnit, Ginger, ko);