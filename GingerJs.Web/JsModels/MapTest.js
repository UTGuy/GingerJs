/// <reference path="ReferenceEntity.js" />
(function($, app, ko, models, i18N, urls) {

    // View Model Class
    function MapTestModel(da, ui) {
        // Private Properties
        var self = this;

        // Public Properties
        this.StringValue = ko.observable('');
        this.SearchText = ko.observable(i18N.MapTest.SearchText);
        this.ObjectValue = ko.observable();
        this.ComplexArrayValue = ko.observableArray();

        // Public Methods
        this.getData = function () {
            da.GetFoos().success(function(newFoo) {
                ko.mapping.fromJS(newFoo, self.Foos);
            }).error(function() {
                //throw "there was an error";
            });
        };

        this.removeFoo = function (foo) {
            if (!ui.ConfirmRemoval(foo)) return;
            da.RemoveFoo(foo.Id).success(function(newFoo) {
                self.ComplexArrayValue.remove(foo);
            }).error(function () {
                //throw "there was an error";
            });
        };

        this.addFoo = function () {
            var id = self.ComplexArrayValue().length + 1;
            var foo = new models.ReferenceEntity({
                Id: id,
                Name: 'array ' + id
            });
            self.ComplexArrayValue.push(foo);
            return foo;
        };
    }

    // Data Access for MapTestModel
    function myDataAccess() {
        this.GetFoos = function() {
            return $.post(urls.MapTest.GetFoos);
        };
        this.RemoveFoo = function(id) {
            return $.post(urls.MapTest.RemoveFoo, id);
        };
    }

    // Ui Methods for MapTestModel
    function myUi() {
        this.ConfirmRemoval = function(foo) {
            return confirm(i18N.MapTest.ConfirmRemovalMessage + foo.Name());
        };
    }

    // Mapping for MapTestModel
    function myMap() {
        return new app.Map({
            "ObjectValue": models.ReferenceEntity,
            "ComplexArrayValue": models.ReferenceEntity
        });
    }

    models.MapTest = app.bindModel(MapTestModel, myMap, myDataAccess, myUi);
    app.setPageModel(models.MapTest);
    console.log("MapTest ", models.MapTest);
    // mock $.post
    $.post = function(/*url, data*/) {
        return {
            success: function(fn) {
                fn({});
            }
        };
    };

})({}, Ginger, ko, t33.models, t33.i18n, t33.urls);