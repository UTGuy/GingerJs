(function(ko) {

    function GingerMap(createMap) {
        var self = this;

        function getProp(prop) {
            if (typeof self[prop] == "undefined")
                self[prop] = {};
            return self[prop];
        }

        function setFn(prop,name,fn) {
            getProp(prop)[name] = fn;
        }
        
        for (var createProp in createMap) {
            var model = createMap[createProp];
            if (typeof model == "undefined")
                throw "'" + createProp + "': map is undefined";
            setFn(createProp, 'create', function (options) {
                return new model(options.data);
            });
        }
    }

    this.Ginger.Map = GingerMap;

})(ko);