﻿(function($, ko) {

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
        var defaults = ko.mapping.defaultOptions();
        var include = map.include || [];
        for (var mapProp in map) {
            include.push(mapProp);
        }
        for (var prop in model) {
            var value = ko.isComputed(model[prop]) ? null : ko.utils.unwrapObservable(model[prop]);
            if (typeof value != "function"
                && $.inArray(prop, defaults.ignore) < 0
                && $.inArray(prop, include) < 0) {
                include.push(prop);
            }
        }
        map.include = include;
    }

    //function ignoreProperties(data, map) {
    //    var defaults = ko.mapping.defaultOptions();
    //    if (typeof map.ignore == "undefined" || map.ignore == defaults.ignore) {
    //        var ignore = [];
    //        for (var prop in data) {
    //            var value = ko.utils.unwrapObservable(data[prop]);
    //            if (typeof value != "function" &&
    //                $.inArray(prop, defaults.ignore) < 0 &&
    //                $.inArray(prop, map.include) < 0) {
    //                ignore.push(prop);
    //            }
    //        }
    //        map.ignore = ignore;
    //    }
    //}

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
    
    Ginger.bindModelWithBase = function(model, base, map, dataAccess, ui) {
        if (base) {
            model.prototype = base.prototype;
            model.prototype.constructor = base;
        }
        
        function GingerModel(data, values, isBase) {
            if (typeof values == "undefined" || values == null)
                values = new GingerModelParams();
            GingerModelParams.call(values, map, dataAccess, ui);
            if (base) base.call(this, data, values, true);
            model.call(this, values.dataAccess, values.ui);
            if (settings.autoProperty) includeProperties(this, values.map);
            //if( settings.autoProperty ) ignoreProperties( data, values.map );
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