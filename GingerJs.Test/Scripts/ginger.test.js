/// <reference path="../UnitTestSetup.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.js" />
/// <reference path="../../GingerJs.Web/Scripts/ginger.mapping.js" />
/// <reference path="../../GingerJs.Web/JsModels/ReferenceEntity.js" />

(function(q, app, ko) {

    // Uncomment this to debug
    //q.moduleDone = function() {
    //};

    q.module("Ginger", {
        setup: function() {
        },
        teardown: function() {
        }
    });

    q.test("Unmapping an instance should not give an empty object", function() {
        var vm = new t33.models.ReferenceEntity();
        vm.Id(1);
        var json = ko.mapping.toJS(vm);
        q.equal(json.Id, 1);
    });

})(QUnit, Ginger, ko);