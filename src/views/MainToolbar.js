/// <reference path="../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../argos-sdk/src/List.js"/>

Ext.namespace("Mobile.SalesLogix");

(function() {
    Mobile.SalesLogix.MainToolbar = Ext.extend(Sage.Platform.Mobile.MainToolbar, {
        showTools: function(tools, options) {
            var hasLeftSideTools;

            for (var i = 0; i < tools.length; i++)
                if (tools[i].side == 'left')
                {
                    hasLeftSideTools = true;
                    break;s
                }

            if (!hasLeftSideTools)
            {
                if (App.getActiveView() != App.getView('home'))
                {
                    tools = tools.concat([{
                        id: 'back',
                        side: 'left',
                        fn: this.navigateBack,
                        scope: this
                    },{
                        id: 'home',
                        side: 'left',
                        fn: this.navigateToHomeView,
                        scope: this
                    }]);
                }
                else
                {
                    // todo: add log out button?
                }
            }

            Mobile.SalesLogix.MainToolbar.superclass.showTools.call(this, tools);
        },
        navigateBack: function() {
            ReUI.back();
        },
        navigateToHomeView: function() {
            App.navigateToHomeView();
        }
    });
})();