(function(ko) {

    // Assigns a new var to the window namespace
    this.Ginger = function() {
    };

    var rootModels = [],
        pageModel = null,
        pageData = null;

    function GingerRoot(model, data, container) {
        this.applyBindings = function() {
            var vm = new model(data);
            $(container).each(function() {
                ko.applyBindings(vm, this);
            });
        };
    }

    function getObjOrFunc(prop) {
        return (typeof prop == "function") ? new prop() : prop || {};
    }

    Ginger.bindModel = function(model, map, dataAccess, ui) {
        return function(data) {
            model.call(this, getObjOrFunc(dataAccess), getObjOrFunc(ui));
            if (typeof map == "function")
                map = map();
            return ko.mapping.fromJS(data, map, this);
        };
    };

    Ginger.addRootModel = function(model, data, container) {
        rootModels.push(new GingerRoot(model, data, container));
    };

    Ginger.setPageModel = function(model) {
        pageModel = model;
    };

    Ginger.setPageData = function(data) {
        pageData = data;
    };

    Ginger.runEngine = function() {
        if (pageModel) {
            Ginger.addRootModel(pageModel, pageData, '#fluentRoot');
        }

        for (var i = 0; i < rootModels.length; i++) {
            rootModels[i].applyBindings();
        }
    };

})(ko);