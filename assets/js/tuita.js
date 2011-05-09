var theData = new Lawnchair({adaptor:'dom'});
var ajax_handler = null; 
var cookie = ''; 
//key:   -> ticket
//key: /login?ticket -> __ttst

function check_cookie() {
    //Set-Cookie: SDO_ACCOUNT_TYPE=; domain=.sdo.com; path=/
    //alert("responseHeader: "+ ajax_handler.getAllResponseHeaders());
    var reg = /Set-Cookie: .*/;
    var result = reg.exec(ajax_handler.getAllResponseHeaders());
    eval((""+result).replace('Set-Cookie: ',"cookie += ';")+"'");
    //alert(cookie);

};

function reset_cookie_from_response() {
    var reg = /Set-Cookie: .*/;
    var result = reg.exec(ajax_handler.getAllResponseHeaders());
    eval((""+result).replace('Set-Cookie: ',"cookie = '")+"'");
    //alert(cookie);
};

function doLoad() {
    theData.get('login', 
        function(theLogin) {
            // Test we actually got a login object
            if (theLogin) {
                // We did, so go to the main page 
                document.location = 'doThings.html';
            } else {
                //displayMessage('No login on file ...');
                x$('#theMessage').inner('No login on file ...');
            }
        } // function(theSettings)
);
}

function doLogin_ticket() {
    var c = 'b_t_s=t104727701073xs; __utmz=143606314.1304858611.3.7.utmcsr=login.sdo.com|utmccn=(referral)|utmcmd=referral|utmcct=/sdo/Logout/appLogout.php; PHPSESSID=39f73ce0e7dcec9e708a5cc483bc7428; __utma=143606314.1618934333.1304846355.1304858611.1304863150.4; __utmc=143606314; __utmb=143606314.7.10.1304863150; tt_login=1; tt_reg=1';
  ajax_handler = $.ajax({
        url: 'http://www.tuita.com/login?refer=&ticket=ST-7dafc45c-f5a5-4640-8e7e-6583d552421c',
        headers: { 
            Cookie: c, 
            Host: 'www.tuita.com',
            Referer: 'http://cas.sdo.com/cas/login?service=http%3A%2F%2Fwww.tuita.com'
            },
        //url: 'https://cas.sdo.com/cas/loginStateService?method=checkstat',
        type: 'get',
        success: go_checkstat 
        });


};
function doLogin() {
    return doLogin_full();
    //return doLogin_ttst();
};
function doLogin_ttst() {
    ajax_handler = $.ajax({
        url: 'http://www.tuita.com/home/getfeed',
        headers: { Cookie: '__ttst=ivwJ6PFI8Ra2-4Y9RAiuRRrGFaVWhLDgc5Up9cA4qZBPpa9IoF1bJyePkCKyERwJcgoWjIpYuVSbAI18hqBaKl5UU68bUR1KexbUjeZj5qYNrshjqH9UUaK1CMe%2ALyPPc7NAG8WIlyF3jyF83nlBbF%2A9T7HMohYJAj3FqWDtsGtFnItSYaWskeuxU46s7q%2Ant6thSG94BsA;'},
        type: 'get',
        success: after_getfeed
        });

};

function doLogin_full() {
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
            headers: { Cookie: cookie },
            success: after_login_sdo
        }); 
    }
};


function after_login_sdo(responseText) { 
    this.responseText = responseText;
    alert("after_login_sdo:responseText: "+this.responseText);
    if(this.responseText == "password missed") { // wrong pass/user!
        alert("wrong username or password"); 
    } else { // Success!
        //    this.responseText = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n <html xmlns="http://www.w3.org/1999/xhtml">\n <head>\n <title>LoginD</title>\n <script>\n location.href = "https://cas.sdo.com/authenticationCallback?savetime=14&autologin=&sessionkey=07DD2D00E843804094C0CBD4A146533Dunilinuxmc&code=2&token=4452C06B93FCEE4DBC8638C62844D6BEunilinuxmc&service=http%3A%2F%2Fwww%2Etuita%2Ecom%2Flogin%3Frefer%3D&appId=256&templateId=&upgradeUrl=&appArea=0&pageType=0&";\n </script>\n </head>\n </html>';
        var regCAPTCHA = /CAPTCHA/;
        var captcha = regCAPTCHA.exec(this.responseText);
        if (captcha) {
            alert('need captcha');
            return;
        };
        var reg = /href = .*;/;
        var result =  reg.exec(this.responseText);
        eval("var href; "+ result);
        //alert(href);
        ajax_handler = $.ajax({
            url: href, 
            type: 'get', 
     //       headers: { Cookie: cookie },
            success: after_login_sdo_href
        });
    }
}; //after_login_sdo

function after_login_sdo_href(responseText) {
    this.responseText = responseText;
    //this.responseText = '<script language="javascript">\n document.location = "http://www.tuita.com/login?refer=&ticket=ST-c96505a7-9f18-4045-b817-2c43e6f021cb";    </script>';
    alert("after_login_sdo_href:"+this.responseText);
    var reg = /ticket=.*;/;
    var result =  reg.exec(this.responseText);
    result = "var href=\"http://zdwalter.tuita.com/?"+result; //FIXME: any other page will cause 302 redirect, which loss cookie by $.ajax
    eval(result);

    var protal_host = 'p.gfw4.info';
    var url = 'http://'+protal_host+"/redirect?url="+escape(href);
    alert(url);
    ajax_handler = $.ajax({
        url: url, 
        type: 'get', 
        headers: { Cookie: " tt_reg=1; tt_login=1; b_t_s=t104867177621xs; __utmz=143606314.1304867178.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=143606314.288821922.1304867178.1304867178.1304867178.1; __utmc=143606314; __utmb=143606314.3.10.1304867178" },
        success: after_login_tuita,
        error: on_error,
    });
}; //after_login_sdo_href

function on_error() {
    alert('network error');
};
function after_login_tuita(responseText) {
    reset_cookie_from_response();
    this.responseText = responseText;
    cookie = cookie.replace(/.*__ttst=/,'__ttst=').replace(/;.*/,'');
    alert('cookie:'+cookie);
    ajax_handler = $.ajax({
        url: 'http://www.tuita.com/home/getfeed',
        headers: { Cookie: cookie},
        type: 'get',
        success: after_getfeed
        });
}; //after_login_tuita

function go_checkstat(responseText) {
    this.responseText = responseText;

    //alert("go_checkstat:"+this.responseText);
    ajax_handler = $.ajax({
        headers: { Cookie: cookie },
        url: 'https://cas.sdo.com/cas/loginStateService?method=checkstat',
        type: 'get',
        success: after_getfeed
        });

};

function after_checkstat(stat) {
    //alert(stat);
    if (stat == "checkstat({'CAS_LOGIN_STATE':'1'})") {
        //alert('login success!');
        ajax_handler = $.ajax({
        url: 'http://www.tuita.com/home/getfeed',
        type: 'get',
        headers: { Cookie: cookie },
        success: after_getfeed});
    }
  
}; //after_checkstat

function after_getfeed(feed) {
    alert('feed:\n'+feed);
};
