var theData = new Lawnchair({adaptor:'dom'});
var ajax_handler = null; 

function check_cookie() {
    //Set-Cookie: SDO_ACCOUNT_TYPE=; domain=.sdo.com; path=/
    alert("responseHeader: "+ ajax_handler.getAllResponseHeaders());
    var reg = /Set-Cookie: .*/;
    var result = reg.exec(ajax_handler.getAllResponseHeaders());
    eval((""+result).replace('Set-Cookie: ',"var cookie_str = '")+"'");

    $.cookie_load(cookie_str);
    alert($.cookie());
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
 
function doLogin() {
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
            success: after_login_sdo
        }); 
    }
};


function after_login_sdo(responseText) { 
    check_cookie();
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
        alert(href);
        ajax_handler = $.ajax({
            url: href, 
            type: 'get', 
            headers: { Cookie: $.cookie() },
            success: after_login_sdo_href
        });
    }
}; //after_login_sdo

function after_login_sdo_href(responseText) {
    check_cookie();
    this.responseText = responseText;
    //this.responseText = '<script language="javascript">\n document.location = "http://www.tuita.com/login?refer=&ticket=ST-c96505a7-9f18-4045-b817-2c43e6f021cb";    </script>';
    alert("after_login_sdo_href:"+this.responseText);
    alert("cookie:"+JSON.stringify(this));
    var reg = /location = .*;/;
    var result =  reg.exec(this.responseText);
    alert(result);
    eval((""+result).replace('location','var href'));
    alert(href);
    ajax_handler = $.ajax({
        url: href, 
        type: 'get', 
        headers: { Cookie: $.cookie() },
        success: after_login_tuita
    });
}; //after_login_sdo_href

function after_login_tuita(responseText) {
    check_cookie();
    this.responseText = responseText;
    alert("after_login_tuita:"+this.responseText);
}; //after_login_tuita
