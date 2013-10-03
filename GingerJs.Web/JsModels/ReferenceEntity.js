(function(app, models, i18N, urls) {

    function Entity() {
        this.Id = ko.observable('');
    }

    models.Entity = app.bindModel(Entity);

    function ReferenceEntity() {
        ReferenceEntity.base.apply(this, arguments);

        var self = this;
        this.Name = ko.observable('');
        this.NameAndId = ko.computed(function() {
            return self.Id() + ": " + self.Name();
        });

        console.log("this ", this);
    }

    models.ReferenceEntity = app.bindModelWithBase(ReferenceEntity, models.Entity);

})(Ginger, t33.models, t33.i18n, t33.urls);