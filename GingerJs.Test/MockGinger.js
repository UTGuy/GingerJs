var Ginger = {
    bindModel: function (model) {
        return model;
    },
    bindModelWithBase: function(model, base) {
        model.base = base;
        return Ginger.bindModel(model);
    },
    setPageModel: function () {
        // do nothing
    }
};