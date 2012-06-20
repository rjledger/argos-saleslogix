define('Mobile/SalesLogix/Views/Activity/OccurrenceSelectList', [
    'dojo/_base/declare',
    'Sage/Platform/Mobile/List'
], function(
    declare,
    List
) {

    return declare('Mobile.SalesLogix.Views.Activity.OccurrenceSelectList', [List], {
        //Templates
        itemTemplate: new Simplate([
            '<h3>',
            '<span>{%: $.$descriptor %}</span>',
            '</h3>'
        ]),

        //Localization
        titleText: 'Edit Recurring&hellip;',
        editSeriesText: 'Edit all Occurrences',
        editOccurenceText: 'Edit this Occurrence',

        //View Properties
        expose: false,
        enableSearch: false,
        id: 'occurrence_select_list',
        editView: 'activity_edit',

        activateEntry: function(params) {
            if (params.key)
            {
                var view = App.getView(this.editView);

                if (view){
                    this.options.recurrence.Leader = this.options.entry.Leader;
                    view.show({
                        entry: ('series' == params.key) ? this.options.recurrence : this.options.entry,
                        title: params.descriptor,
                        returnTo: this.options && this.options.returnTo,
                        insert: false
                    }, {
                        returnTo: -1
                    });
                }
            }
        },
        refreshRequiredFor: function(options) {
            return (this.options) ? options : true;
        },
        hasMoreData: function() {
            return false;
        },
        requestData: function() {
            var list = [{
                '$key': 'occurrence',
                '$descriptor': this.editOccurenceText
            },{
                '$key': 'series',
                '$descriptor': this.editSeriesText
            }];

            this.processFeed({'$resources': list});
        },
        init: function() {
            this.inherited(arguments);
        },
        createToolLayout: function() {
            return this.tools || (this.tools = {
                tbar: []
            });
        }
    });
});