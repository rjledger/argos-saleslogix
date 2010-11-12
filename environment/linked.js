(function(){
    App.registerService('saleslogix', {
        serverName: 'ec2-174-129-133-229.compute-1.amazonaws.com',
        virtualDirectory: 'sdata',
        applicationName: 'slx',
        contractName: 'dynamic',
        port: window.location.port && window.location.port != 80 ? window.location.port : false,
        json: true,
        protocol: /https/i.test(window.location.protocol) ? 'https' : false
    }, { isDefault: true, offline: true });
    App.registerService('gcrm', {
        serverName: 'slxbrowser.sagesaleslogixcloud.com',
        virtualDirectory: 'sdata',
        applicationName: 'aw',
        contractName: 'crmerp',
        port: 8000,
        protocol: /https/i.test(window.location.protocol) ? 'https' : false
    }, { isDefault: false, offline: true });
})();

