(function(app, models, i18N, urls) {

    function ReferenceEntity() {
        var self = this;
        self.Id = ko.observable('');
        self.Name = ko.observable('');
        self.NameAndId = ko.computed(function() {
            return self.Id() + ": " + self.Name();
        });
    }

    models.ReferenceEntity = app.bindModel(ReferenceEntity);

})(Ginger, t33.models, t33.i18n, t33.urls);