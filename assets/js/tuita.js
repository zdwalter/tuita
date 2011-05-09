var theData = new Lawnchair({adaptor:'dom'});
var ajax_handler = null; 
//key:   -> ticket
//key: /login?ticket -> __ttst

function check_cookie() {
    //Set-Cookie: SDO_ACCOUNT_TYPE=; domain=.sdo.com; path=/
    //alert("responseHeader: "+ ajax_handler.getAllResponseHeaders());
    var reg = /Set-Cookie: .*/i;
    var result = reg.exec(ajax_handler.getAllResponseHeaders());
    eval((""+result).replace(/Set-Cookie: /i,"cookie += ';")+"'");
    debug(cookie);

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


