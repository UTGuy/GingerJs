(function($, ko) {

    // Assigns a new var to the window namespace
    this.Ginger = function() {
    };

    var rootModels = [],
        page = {
            model: null,
            data: null
        },
        settings = {
            pageContainer: "body",
            autoProperty: true
        };

    Ginger.settings = function(options) {
        if (typeof options != "object") return;
        for (var prop in options) {
            settings[prop] = options[prop];
        }
    };

    function GingerRoot(model, data, container) {
        this.applyBindings = function() {
            var vm = new model(data);
            $(container).each(function() {
                ko.applyBindings(vm, this);
            });
        };
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

    function setBase(model, base) {
        model.prototype = base.prototype;
        model.prototype.constructor = base;
    }

    function GingerModelParams(map, dataAccess, ui) {

        function getObjOrFunc(prop) {
            return (typeof prop == "function") ? new prop() : prop || {};
        }

        this.map = getObjOrFunc(map);
        this.dataAccess = getObjOrFunc(dataAccess);
        this.ui = getObjOrFunc(ui);
    }

    Ginger.bindModelWithBase = function(model, base, map, dataAccess, ui) {
        model.base = base;
        return Ginger.bindModel(model, map, dataAccess, ui);
    };
    
    Ginger.bindModel = function(model, map, dataAccess, ui) {
        if (model.base) setBase(model, model.base);

        function GingerModel(data) {
            var values = new GingerModelParams(map, dataAccess, ui);
            //if (model.base) model.base.call(this, values.dataAccess, values.ui);
            model.call(this, values.dataAccess, values.ui);
            if (settings.autoProperty) includeProperties(this, values.map);
            ko.mapping.fromJS(data, values.map, this);
        }

        setBase(GingerModel, model);
        return GingerModel;
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