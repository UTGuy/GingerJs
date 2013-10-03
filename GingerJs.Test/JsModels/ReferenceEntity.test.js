/// <reference path="../UnitTestSetup.js" />
/// <reference path="../MockGinger.js" />
/// <reference path="../../GingerJs.Web/JsModels/ReferenceEntity.js" />
(function(q) {

    // Uncomment this to debug
    //q.moduleDone = function () {
    //};
    
    q.module("ReferenceEntity", {
        setup: function() {
        },
        teardown: function() {
        }
    });

    //q.test("ReferenceEntity is an Entity", function() {
    //    var vm = new t33.models.ReferenceEntity();
    //    q.equal(vm instanceof t33.models.ReferenceEntity, true);
    //    q.equal(vm instanceof t33.models.Entity, true);
    //});

    q.test("NameAndId returns name and id", function() {
        var vm = new t33.models.ReferenceEntity();
        vm.Id(1);
        q.equal(1, vm.Id());

        vm.Name("Foo");
        q.equal(vm.Name(), "Foo");

        q.equal(vm.NameAndId(), "1: Foo");
    });

})(QUnit);