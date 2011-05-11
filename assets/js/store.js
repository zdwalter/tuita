var store = new Lawnchair({adaptor:'dom'});
var config = {
    //portal: 'http://localhost'
    portal: 'http://p.gfw4.info', //TODO: detect host
    redirect: true
};
var login = {
    tuita_cookie: null,
    username: null,
    password: null,
};

function store_load() {
    //debug('store_load');
    if (window.location.hostname) {
        config.portal = "http://"+window.location.hostname;
    }
    store.get('db', function(saved) {
        //debug('saved:'+JSON.stringify(saved));
        if (saved) {                                                                 
            if (saved.login) {                                                         
                login = saved.login;
            }                                                                        
            //if (saved.config) {
            //    config = saved.config;
            //}
        }                                                                            
    });
};

function store_save() {
    //debug('store_save');
    store.save({
        key:'db',
        login: login,
        //config: config,
    });
};
