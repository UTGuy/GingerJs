var Ginger = {
    bindModel: function (model) {
        return model;
    },
    bindModelWithBase: function(model, base) {
        model.base = base;
        var m = model;
        return Ginger.bindModel(function() {
            base.apply(this, arguments);
            return m.apply(this, arguments);
        });
    },
    setPageModel: function () {
        // do nothing
    }
};