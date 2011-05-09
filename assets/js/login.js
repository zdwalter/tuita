
var theData = new Lawnchair({adaptor:'dom'});

function test_login() {
    debug('test_login')
    var logined = false;
    if (logined) 
        display('#home');
    else {
        debug('user/pass:'+ login.username + "," + login.password);
        if (login.username) 
            x$('input#username').attr('value', login.username);
        if (login.password) 
            x$('input#username').attr('value', login.password);
        
        display('#login');
    }
};

function doLogin() {
    try {
        debug('doLogin');
        var username = $("input#username").val();
        debug('user/pass:'+ login.username + "," + login.password);
        if (!login.username && username) 
            login.username = username;

        var password = $("input#password").val();
        if (!login.password && password) 
            login.password = password;
        store_save();
        debug('user/pass:'+ login.username + "," + login.password);
        return doLogin_full();
    }
    catch(error) {
        on_error(error.description);
    }
    //return doLogin_ttst();
};

