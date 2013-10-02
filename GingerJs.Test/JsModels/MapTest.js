/// <reference path="ReferenceEntity.js" />
(function($, app, ko, models, i18N, urls) {

    // View Model Class
    function MapTestModel(da, ui) {
        // Private Properties
        var self = this;

        // Public Properties
        self.StringValue = ko.observable('');
        self.SearchText = ko.observable(i18N.MapTest.SearchText);
        self.ObjectValue = ko.observable();
        self.ComplexArrayValue = ko.observableArray();

        // Public Methods
        self.getData = function() {
            da.GetFoos().success(function(newFoo) {
                ko.mapping.fromJS(newFoo, self.Foos);
            }).error(function() {
                //throw "there was an error";
            });
        };

        self.removeFoo = function(foo) {
            if (!ui.ConfirmRemoval(foo)) return;
            da.RemoveFoo(foo.Id).success(function(newFoo) {
                self.ComplexArrayValue.remove(foo);
            }).error(function () {
                //throw "there was an error";
            });
        };

        self.addFoo = function() {
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
            return confirm(i18N.ConfirmRemovalMessage + foo.Name());
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

    // mock $.post
    $.post = function(/*url, data*/) {
        return {
            success: function(fn) {
                fn({});
            }
        };
    };

})({}, Ginger, ko, t33.models, t33.i18n, t33.urls);