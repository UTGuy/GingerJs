/// <reference path="knockout-2.2.0.debug.js" />
/// <reference path="ginger.js" />
(function(ginger) {

    function GingerMap(model) {
        var self = this;

        function getProp(prop) {
            if (typeof self[prop] == "undefined")
                self[prop] = {};
            return self[prop];
        }

        function setFn(model, prop, name) {
            getProp(prop)[name] = function (options) {
                return new model(options.data);
            };
        }

	    for (var prop in model) {
		    var propModel = model[prop];
		    if (typeof propModel == "undefined")
			    throw "'" + prop + "': map is undefined";

		    if (prop == "ignore") self[prop] = model[prop];
		    else setFn(propModel, prop, 'create');
	    }
    }

    ginger.Map = GingerMap;

})(Ginger);