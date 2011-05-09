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
            if (saved.login) {                                                         
                login = saved.login;
            }                                                                        
            if (saved.config) {
                config = saved.config;
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
