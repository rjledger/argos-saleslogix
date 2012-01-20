define('configuration/development', ['Mobile/SalesLogix/ApplicationModule'], function() {

    return {
        modules: [
            new Mobile.SalesLogix.ApplicationModule()
        ],
        connections: {
            'crm': {
                isDefault: true,
                offline: true,
                // url: 'http://50.16.242.109/sdata/slx/dynamic/-/',
                url: 'http://10.40.242.208/sdata/slx/dynamic/-/',
                json: true
            }
        },
        enableUpdateNotification: true
    };

});