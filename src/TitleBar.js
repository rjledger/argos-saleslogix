define('Mobile/SalesLogix/TitleBar', [
    'dojo/_base/declare',
    'argos/TitleBar',
    'argos!scene'
], function(
    declare,
    TitleBar,
    scene
) {
    return declare('Mobile.SalesLogix.TitleBar', [TitleBar], {

        homeView: 'home',

        titleText: 'SalesLogix',

        _setItemsAttr: function(items) {
            var hasItemsOnLeft;

            if (items)
            {
                for (var i = 0; i < items.length; i++)
                {
                    if (items[i].place == 'left')
                    {
                        hasItemsOnLeft = true;
                        break;
                    }
                }
            }

            if (hasItemsOnLeft || items === false) return this.inherited(arguments);

            var pane = this.getParent(),
                active = pane && pane.active;
            if (active && active.id != this.homeView)
            {
                if (pane.tier < (scene().layout.tiers - 1)) {
                    if (false !== active.enableNavigateUp && true !== active.disableNavigateUp)
                        items = (items || []).concat([{
                            name: 'up',
                            place: 'left',
                            fn: this.navigateUp,
                            args: [pane.tier]
                        }]);

                } else {
                    items = (items || []).concat([{
                        name: 'back',
                        place: 'left',
                        publish: '/app/scene/back'
                    },{
                        name: 'home',
                        place: 'left',
                        fn: this.navigateToHomeView,
                        scope: this
                    }]);
                }
            }

            this.inherited(arguments);
        },
        navigateToHomeView: function() {
            scene().showView.apply(scene(), [this.homeView]);
        },
        navigateUp: function(tier) {
            scene().navigateUp.apply(scene(), [tier]);
        }
    });
});