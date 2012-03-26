/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>

define('Mobile/SalesLogix/Views/Address/List', ['Sage/Platform/Mobile/List'], function() {

    return dojo.declare('Mobile.SalesLogix.Views.Address.List', [Sage.Platform.Mobile.List], {
        //Templates
        itemTemplate: new Simplate([
            '<div class="note-text-item" data-action="viewAddress" data-key="{%= $.$key %}">',
                '<h4>{%: $.$descriptor %}</h4>',
                '<div class="note-text-wrap">',
                    '{%: Mobile.SalesLogix.Format.address($, true, "\\n") %}',
                '</div>',
            '</div>'
        ]),

        //Localization
        titleText: 'Additional Addresses',

        //View Properties        
        detailView: null,
        icon: 'content/images/icons/Map_24.png',
        id: 'address_list',
        security: null, //'Entities/Address/View',
        insertSecurity: 'Entities/Address/Add',
        insertView: 'address_edit',
        queryWhere: 'EntityId eq "${0}" and id ne "${1}"',
        resourceKind: 'addresses',

        formatSearchQuery: function(query) {
            return dojo.string.substitute(query, [this.entry.EntityId, this.entry[$key]]);
        },
        // Disable Add/Insert on toolbar
        createToolLayout: function() {
            return this.tools || (this.tools = {
                tbar: []
            });
        },
        viewAddress: function(o) {
            App.showMapForAddress(Mobile.SalesLogix.Format.address(this.entries[o.key], true, ' '));
        }
    });
    
});