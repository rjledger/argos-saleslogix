/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>


define('Mobile/SalesLogix/Views/TicketActivity/RateLookup', [
    'dojo/_base/declare',
    'dojo/string',
    'Sage/Platform/Mobile/List'
], function(
    declare,
    string,
    List
) {

    return declare('Mobile.SalesLogix.Views.TicketActivity.RateLookup', [List], {
        //Templates
        itemTemplate: new Simplate([
            '<h3>{%: $.RateTypeCode %} - {%: $.Amount %}</h3>',
            '<h4>{%: $.TypeDescription %}</h4>'
        ]),

        //Localization
        titleText: 'Rates',

        //View Properties
        id: 'ticketactivity_ratelookup',
        expose: false,
        queryOrderBy: 'Amount asc',
        querySelect: [
            'Amount',
            'RateTypeCode',
            'TypeDescription'
        ],
        resourceKind: 'ticketActivityRates',

        formatSearchQuery: function(searchQuery) {
            return string.substitute('upper(RateTypeCode) like "%${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
        }
    });
});