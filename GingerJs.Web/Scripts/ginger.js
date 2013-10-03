(function($, ko) {

    var rootModels = [],
        page = {
            model: null,
            data: null
        },
        settings = {
            pageContainer: "body",
            autoProperty: true,
        };

    // Assigns a new var to the window namespace
    this.Ginger = function() {
    };

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

    function includeProperties(model, map) {
        if (typeof map.include == "undefined") {
            var include = [];
            for (var prop in model) {
                var value = ko.utils.unwrapObservable(this[prop]);
                if (typeof value != "function")
                    include.push(prop);
            }
            map.include = include;
        }
    }

    Ginger.settings = function(options) {
        if (typeof options != "object") return;
        for (var prop in options) {
            settings[prop] = options[prop];
        }
    };

    Ginger.bindModel = function(model, map, dataAccess, ui) {
        return function(data) {
            model.call(this, getObjOrFunc(dataAccess), getObjOrFunc(ui));
            map = getObjOrFunc(map);
            if (settings.autoProperty) includeProperties(this, map);
            return ko.mapping.fromJS(data, map, this);
        };
    };

    Ginger.addRootModel = function(model, data, container) {
        rootModels.push(new GingerRoot(model, data, container));
    };

    Ginger.setPageModel = function(model) {
        page.model = model;
    };

    Ginger.setPageData = function(data) {
        page.data = data;
    };

    Ginger.runEngine = function() {
        if (page.model) {
            Ginger.addRootModel(page.model, page.data, settings.pageContainer);
        }

        for (var i = 0; i < rootModels.length; i++) {
            rootModels[i].applyBindings();
        }
    };

})(jQuery, ko);