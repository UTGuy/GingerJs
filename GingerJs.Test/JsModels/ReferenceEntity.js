(function(app, models, i18N, urls) {

    function Entity() {
        this.Id = ko.observable('');
    }

    models.Entity = app.bindModel(Entity);

    function ReferenceEntity() {
        // base class
        ReferenceEntity.prototype.call(this, arguments);

        var self = this;
        self.Name = ko.observable('');
        self.NameAndId = ko.computed(function() {
            return self.Id() + ": " + self.Name();
        });
    }
    ReferenceEntity.prototype = models.Entity;
    
    models.ReferenceEntity = app.bindModel(ReferenceEntity);

})(Ginger, t33.models, t33.i18n, t33.urls);