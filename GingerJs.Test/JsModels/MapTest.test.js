﻿/// <reference path="../UnitTestSetup.js" />
/// <reference path="../MockGinger.js" />
/// <reference path="../../GingerJs.Web/JsModels/MapTest.js" />

(function(q) {

    // Uncomment this to debug
    //q.moduleDone = function() {
    //};

    q.module("MapTest", {
        setup: function() {
            t33.i18n.MapTest = {
                SearchText: ""
            };
            t33.urls.MapTest = {
                GetFoos: "",
                RemoveFoo: ""
            };
        },
        teardown: function() {
        }
    });

    q.test("Can add Foo", function() {
        var vm = new t33.models.MapTest();
        vm.addFoo();
        q.equal(vm.ComplexArrayValue().length, 1);
    });

    q.test("Can remove Foo if confirmed", function() {

        var mockDa = {
            RemoveFoo: function() {
                var _ = {
                    success: function(fn) {
                        fn();
                        return _;
                    },
                    error: function() {
                        return _;
                    }
                };
                return _;
            }
        };

        var mockUi = {
            ConfirmRemoval: function() {
                return true;
            }
        };

        var vm = new t33.models.MapTest(mockDa, mockUi);

        var foo = new t33.models.ReferenceEntity();
        vm.ComplexArrayValue.push(foo);
        q.equal(vm.ComplexArrayValue().length, 1);

        vm.removeFoo(foo);
        q.equal(vm.ComplexArrayValue().length, 0);
    });

    q.test("Cannot remove Foo if not confirmed", function() {

        var mockUi = {
            ConfirmRemoval: function() {
                return false;
            }
        };

        var vm = new t33.models.MapTest(null, mockUi);

        var foo = new t33.models.ReferenceEntity();
        vm.ComplexArrayValue.push(foo);
        q.equal(vm.ComplexArrayValue().length, 1);

        vm.removeFoo(foo);
        q.equal(vm.ComplexArrayValue().length, 1);
    });

})(QUnit);