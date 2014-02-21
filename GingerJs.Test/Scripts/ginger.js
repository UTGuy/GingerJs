(function($, ko) {

	var koDependantObservable = ko.dependentObservable;
	// Fixes an issue with the mapping-latest plugin re-assigning ko.dependentObservable
	function koIsComputed(instance) {
		return ko.hasPrototype(instance, koDependantObservable);
	}
	
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
            autoProperty: true,
            includeComputed: false
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

    function includeModelProperties(model, map) {
        var defaults = ko.mapping.defaultOptions();
        var include = map.include || [];
        for (var mapProp in map) {
            include.push(mapProp);
        }
        for (var prop in model) {
            var modelVal = model[prop];
            var isComputed = koIsComputed(modelVal);
            if (!settings.includeComputed && isComputed) continue;
            var value = isComputed ? null : ko.utils.unwrapObservable(modelVal);
            if (typeof value != "function"
                && $.inArray(prop, defaults.ignore) < 0
                && $.inArray(prop, include) < 0) {
                include.push(prop);
            }
        }
        map.include = include;
    }

    function GingerModelParams(map, dataAccess, ui) {

        function getObjOrFunc(prop) {
            return (typeof prop == "function") ? new prop() : prop || {};
        }

        this.load = this.load || [];
        this.map = $.extend(getObjOrFunc(map), this.map || {});
        this.dataAccess = $.extend(getObjOrFunc(dataAccess), this.dataAccess || {});
        this.ui = $.extend(getObjOrFunc(ui), this.ui || {});
    }

    Ginger.bindModel = function(model, map, dataAccess, ui) {
        return Ginger.bindModelWithBase(model, null, map, dataAccess, ui);
    };

    function isReadOnlyComputed(value) {
        if (!ko.isComputed(value)) return false;
        return ko.isComputed(value) && !ko.isWriteableObservable(value);
    }

    function removeReadOnlyComputedProperties(data) {
        var valid = {};
        for (var prop in data) {
            if (!isReadOnlyComputed(this[prop]))
                valid[prop] = data[prop];
        }
        return valid;
    }

    Ginger.bindModelWithBase = function(model, base, map, dataAccess, ui) {
        if (base) {
            model.prototype = base.prototype;
            model.prototype.constructor = base;
        }

        function GingerModel(data, values, isBase) {
            if (typeof values == "undefined" || values == null) {
                values = new GingerModelParams();
            }
            GingerModelParams.call(values, map, dataAccess, ui);
            if (base) base.call(this, data, values, true);
            model.call(this, values.dataAccess, values.ui);
            if (settings.autoProperty) includeModelProperties(this, values.map);
            data = removeReadOnlyComputedProperties.call(this, data);
            if (typeof this.load == "function") values.load.push(this.load);
            if (!isBase) {
                ko.mapping.fromJS(data, values.map, this);
                for (var i = values.load.length; i > 0; i--) {
                    values.load[i - 1]();
                }
            }
        }

        GingerModel.prototype = model.prototype;
        GingerModel.prototype.constructor = model;

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