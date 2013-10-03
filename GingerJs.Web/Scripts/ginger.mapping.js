/// <reference path="knockout-2.2.0.debug.js" />
/// <reference path="ginger.js" />
(function(ginger) {

    function GingerMap(createMap) {
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

        function addPropMap(prop, map, type) {
            var propModel = createMap[createProp];
            if (typeof propModel == "undefined")
                throw "'" + createProp + "': map is undefined";
            setFn(propModel, createProp, type);
        }

        for (var createProp in createMap) {
            addPropMap(createProp, createMap, 'create');
        }
    }

    ginger.Map = GingerMap;

})(Ginger);