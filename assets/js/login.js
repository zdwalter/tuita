
//key:   -> ticket
//key: /login?ticket -> cookie:__ttst
var theData = new Lawnchair({adaptor:'dom'});
var cookie = null;
var tries = 0;
var ajax_handler = null; 

function test_login() {
    debug('test_login');
    if (is_login) 
        go_home();
    else {
        //debug('user/pass:'+ login.username + "," + login.password);
        if (login.username) 
            x$('input#username').attr('value', login.username);
        if (login.password) 
            x$('input#password').attr('value', login.password);
        
        doLogin();
    }
};

function doLogin() {
    tries = 0;
    try {
        debug('doLogin');
        var username = $("input#username").val();
        if (username) 
            login.username = username;

        var password = $("input#password").val();
        if (password) 
            login.password = password;
        debug('user/pass:'+ login.username + "," + login.password);
        store_save();

        if (login.tuita_cookie)
            return login_tuita_with_cookie();
        if (login.username && login.password)
            return login_by_user_pass();
        return display('#login');
    }
    catch(error) {
        on_error(error.description);
    }
};

function reset_cookie_from_response() {
    debug('reset_cookie_from_response');
    debug(ajax_handler.getAllResponseHeaders());
    var reg = /Set-Cookie: .*/i;
    var result = reg.exec(ajax_handler.getAllResponseHeaders());
    debug(result);
    eval((""+result).replace(/Set-Cookie: /i,"cookie = '")+"'");
    debug(cookie);
};

function login_by_user_pass() {
    debug('login_by_user_pass');
    var url = "https://dplogin.sdo.com/dispatchlogin.fcgi";
    // Retrieve the values from the form elements
    var postStr = "";
    x$("input[type=hidden]").each(function(el) {
        postStr += el.name+'='+escape(el.value)+"&";
    });
    var username = $("input#username").val();
    var password = $("input#password").val();
    if ( !username || !password) {
        alert("please input username and password");
        return display('#login');
    } else {
        postStr += 'username='+escape(username)+"&";
        postStr += 'ptname='+escape(username)+"&";
        postStr += 'password='+escape(password)+"&";
        postStr += 'ptpwd='+escape(password)+"&";
        postStr += 'auto_login=';

        ajax_handler = $.ajax({
            url: url,  
            type: 'post',
            data: postStr,
            //headers: { Cookie: cookie },
            success: after_login_sdo,
            error: on_login_error
        }); 
    }
};

function after_login_sdo(responseText) { 
    this.responseText = responseText;
    debug("after_login_sdo:responseText: "+this.responseText);
    if(this.responseText == "password missed") { // wrong pass/user!
        alert("wrong username or password"); 
        return display('#login');
    } else { // Success!
        //    this.responseText = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n <html xmlns="http://www.w3.org/1999/xhtml">\n <head>\n <title>LoginD</title>\n <script>\n location.href = "https://cas.sdo.com/authenticationCallback?savetime=14&autologin=&sessionkey=07DD2D00E843804094C0CBD4A146533Dunilinuxmc&code=2&token=4452C06B93FCEE4DBC8638C62844D6BEunilinuxmc&service=http%3A%2F%2Fwww%2Etuita%2Ecom%2Flogin%3Frefer%3D&appId=256&templateId=&upgradeUrl=&appArea=0&pageType=0&";\n </script>\n </head>\n </html>';
        var regCAPTCHA = /CAPTCHA/i;
        var captcha = regCAPTCHA.exec(this.responseText);
        if (captcha) {
            alert('require input captcha; not support yet, please try later(1min)');
            display('#login');
            return;
        };

        var regAlert = /alert\(msgobj\)/i;
        if (regAlert.exec(responseText)) {
            alert('login failed');
            show_log();
            return display('#login');
        }
        var reg = /href = .*;/i;
        var result =  reg.exec(this.responseText);
        eval("var href; "+ result);
        //alert(href);
        ajax_handler = $.ajax({
            url: href, 
            type: 'get', 
     //       headers: { Cookie: cookie },
            success: after_login_sdo_href,
            error: on_login_error
        });
    }
}; //after_login_sdo

function after_login_sdo_href(responseText) {
    this.responseText = responseText;
    //this.responseText = '<script language="javascript">\n document.location = "http://www.tuita.com/login?refer=&ticket=ST-c96505a7-9f18-4045-b817-2c43e6f021cb";    </script>';
    debug("after_login_sdo_href:"+this.responseText);
    var reg = /ticket=.*;/i;
    var result =  reg.exec(this.responseText);
    result = "var href=\"http://zdwalter.tuita.com/?"+result; //FIXME: any other page will cause 302 redirect, which loss cookie by $.ajax
    eval(result);

    var protal_host = config.portal;
    var url = 'http://'+protal_host+"/redirect?app=tuita&url="+escape(href);
    debug(url);
    ajax_handler = $.ajax({
        url: url, 
        type: 'get', 
        headers: { Cookie: " tt_reg=1; tt_login=1; b_t_s=t104867177621xs; __utmz=143606314.1304867178.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=143606314.288821922.1304867178.1304867178.1304867178.1; __utmc=143606314; __utmb=143606314.3.10.1304867178" },
        success: after_login_tuita,
        error: on_login_error,
    });
}; //after_login_sdo_href

function after_login_tuita(responseText) {
    debug('after_login_tuita:'+responseText);
    reset_cookie_from_response();
    //this.responseText = responseText;
    //debug('cookie:'+cookie);
    //cookie = cookie.replace(/.*__ttst=/,'__ttst=').replace(/;.*/,'');
    //debug('cookie:'+cookie);
    login.tuita_cookie = cookie;
    store_save();

    login_tuita_with_cookie();
};

function login_tuita_with_cookie() {
    ajax_handler = $.ajax({
        url: 'http://www.tuita.com/home/getfeed',
        headers: { Cookie: login.tuita_cookie},
        type: 'get',
        success: test_getfeed,
        error: on_login_error
        });
}; //after_login_tuita

function test_getfeed(feed) {
    debug('feed:\n'+feed);
    eval('var feed = '+feed);
    if (feed.errno == 0) {
        is_login = true;
        go_home();
    }
    else {
        is_login = false;
        if (tries > 0) { //called from login_by_user_pass
            alert('login failed');
            show_log();
            return display('#login');
        }
        else {
            tries += 1;
            if (login.username && login.password)
                return login_by_user_pass();
            return display('#login');
        }
    }
};

function on_login_error(err) {
    on_error(err);
    display('#login');
};
