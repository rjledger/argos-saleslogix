/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>

Ext.namespace("Mobile.SalesLogix.Account");

(function() {
    Mobile.SalesLogix.Account.List = Ext.extend(Sage.Platform.Mobile.List, {
        //Templates
        itemTemplate: new Simplate([
            '<li data-action="activateEntry" data-key="{%= $.$key %}" data-descriptor="{%: $.$descriptor %}" class="{%= $$.isLinked($) ? "linked-account" : "" %}">',
            '<div data-action="selectEntry" class="list-item-selector"></div>',
            '{%! $$.contentTemplate %}',
            '</li>'
        ]),
        contentTemplate: new Simplate([
            '<h3>{%: $.AccountName %}</h3>',
            '<h4>{%: $.AccountManager && $.AccountManager.UserInfo ? $.AccountManager.UserInfo.UserName : "" %}</h4>'
        ]),

        //Localization
        titleText: 'Accounts',

        //View Properties
        contextItems: [
            {
                '$key': 'activities',
                view: 'activity_related',
                where: "AccountId eq '{0}'"
            },
            {
                '$key': 'notes',
                view: 'note_related',
                where: "AccountId eq '{0}' and Type eq 'atNote'"
            },
            {
                '$key': 'schedule',
                view: 'activity_types_list'
            }
        ],
        contextView: 'context_dialog',
        detailView: 'account_detail',
        icon: 'content/images/icons/Company_24.png',
        id: 'account_list',
        insertView: 'account_edit',
        queryOrderBy: 'AccountName',
        querySelect: [
            'AccountName',
            'AccountManager/UserInfo/UserName'
        ],
        resourceKind: 'accounts',
        queryHashTags: {
            'linked': '$uuid ne null'
        },

        isLinked: function(entry) {
            return (entry.$uuid != "00000000-0000-0000-0000-000000000000");
        },
        formatSearchQuery: function(query) {
            var tagQueryMatch = /^(?:#|;|,|\.)(\w+)/.exec(query);
            if (tagQueryMatch && this.queryHashTags[tagQueryMatch[1]]) return this.queryHashTags[tagQueryMatch[1]];

            return String.format('AccountName like "%{0}%"', query);
        }
    });
})();