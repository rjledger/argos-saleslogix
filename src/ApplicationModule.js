define('Mobile/SalesLogix/ApplicationModule', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'argos/ApplicationModule',
    './ApplicationViews',
    'argos/Fields/FieldRegistry',
    './Fields/AddressField',
    './Fields/NameField',
    './Fields/NoteField',
    './Fields/PicklistField',
    './Fields/RecurrencesField',
    'argos/List'
], function(
    declare,
    lang,
    ApplicationModule,
    ApplicationViews,
    FieldRegistry,
    AddressField,
    NameField,
    NoteField,
    PicklistField,
    RecurrencesField,
    List
) {

    return declare('Mobile.SalesLogix.ApplicationModule', [ApplicationModule], {
        searchText: 'Lookup',
        loadViews: function(scene) {
            this.inherited(arguments);
            lang.extend(List, {
                searchText: this.searchText
            });

            scene.registerViews(ApplicationViews);
            this.registerFields();
        },
        registerFields: function() {
            var fieldMap = {
                'address': AddressField,
                'name': NameField,
                'note': NoteField,
                'picklist': PicklistField,
                'recurrences': RecurrencesField
            };

            FieldRegistry.register(fieldMap);
        },
        loadCustomizations: function() {
        },
        loadBaseCustomizations: function() {
        }
    });

});
