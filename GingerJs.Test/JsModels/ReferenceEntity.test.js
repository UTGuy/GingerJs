/// <reference path="../UnitTestSetup.js" />
/// <reference path="JsModels.module.js" />
/// <reference path="../../GingerJs.Web/JsModels/ReferenceEntity.js" />
(function(q) {

    q.module("ReferenceEntity", {
        setup: function () {

        },
        teardown: function () {
        }
    });
    
    q.test("NameAndId returns name and id", function() {
        var vm = new t33.models.ReferenceEntity();
        vm.Id(1);
        q.equal(1, vm.Id());

        vm.Name("Foo");
        q.equal("Foo", vm.Name());

        q.equal("1: Foo", vm.NameAndId());
    });

})(QUnit);