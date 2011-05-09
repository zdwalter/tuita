var store = new Lawnchair({adaptor:'dom'});
var config = {
    debug: true,
    portal: 'p.gfw4.info'
};
var login = {
    cookie: null,
    username: null,
    password: null,
};

function store_load() {
    debug('store_load');
    store.get('db', function(saved) {
        debug('saved:'+JSON.stringify(saved));
        if (saved) {                                                                 
            debug('saved:'+JSON.stringify(saved));
            debug('saved.login:'+JSON.stringify(saved.login));
            debug('saved:config:'+JSON.stringify(saved.config));
            if (saved.login) {                                                         
                debug(save.login);
                login = save.login;
            }                                                                        
            if (saved.config) {
                debug(save.config);
                config = save.config;
            }
        }                                                                            
    });
};

function store_save() {
    debug('store_save');
    store.save({
        key:'db',
        login: login,
        config: config,
    });
};
