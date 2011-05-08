document.domain = 'sdo.com';
/*
    服务器端变量统一赋值
*/
var SerIsAutomaticallyLogged = "0"; //是否已经自动登录 (bool)
var SerAutologinWarntext     = "";    //选中自动登录后提示 (string)
var SerAutoLoginWaitingMsg   = "";

var SerAutoLogin = "1";     //自动登录 标记 (bool)
var SerReturnURL = "http://www.tuita.com/login?refer=";    //跳转返回的url (string)
var SerAppId     = "256";         //appid (string)
var SerCurURL    = "http://www.tuita.com/login";       //当前url (string) 
//var SerLoginAuto = ""; //cookie: CAS_AUTO_LOGIN  标记(string)
//var SerLoginStat = "0";
var SerWEBSSO    = "https://dplogin.sdo.com/dispatchlogin.fcgi"        //自动登录的 提交地址   (string) 
var SerWebCas    = "https://cas.sdo.com/cas/login?gateway=true&service=http%3A%2F%2Fwww.tuita.com%2Flogin%3Frefer%3D";
var SerMsg       = "";
var SerUsernameTip = "" 
var SerSafeEdit    = "0";
var SerCodeBase    = "https://login.sdo.com/sdo/Login/SafeEdit.cab#version=1,7,0,1";
var SerDownload    = "SafeEditOCX_Setup.exe";
 /*
    参数定义:
    
    GUID             //guid
    bgStart          //后台处理开始 
    bgEnd            //后台处理结束
    contentLoaded    //html下载完成 也就是onload开始
    resouceLoaded    //所有资源下载结束 也就是onload结束
    renderStart      //开始渲染  (约等于此时间)
    renderEnd        //结束渲染  (约等于此时间)
*/
var reportUrl    = "";  //后面要保证带问号


/*
 工具函数
*/
//清掉两边空格
function trim( str )
{   
    return str.replace( /^\s+/,'' ).replace( /\s+$/,'' );
}
//getElByid
function $(id)
{ 
    return document.getElementById(id);
}
//检查是否包含不安全值
function checkValue( val, warn )
{
    val = "a" + val; 
    var chkResult = val.match( /[\s"'<>;‘]/g );
    if( !chkResult )return true;
    alert( warn + chkResult.join(',') );
    return false;
}
//验证-并提示
function validateValue( txtbox,defauVal,warn )
{   
    var val = txtbox.value;
    if( val=='' || val==defauVal ) 
    {
        alert( warn );
        txtbox.focus();
        return false;
    }
    return true;
}
//给url增加参数
function addPara( url,key,value )
{ 
    return parseUrl( url ).addPara( key,value ).toString();
}  
//给url删除参数    
function delPara( url,key )
{
    return parseUrl( url ).delPara( key ).toString();
}    
//url分析器,对上面两个函数进行支持
function parseUrl( url )
{
    var lnk = document.createElement('a'); 
    lnk.href = url;
    var path = lnk.protocol + '//' + lnk.host + '/' + lnk.pathname.replace(/^\//,''),
    params = lnk.search.replace(/^\?/,''),
    hash   = lnk.hash,
    paraArr = params ? params.split('&') : [],
    paraObj = {},
    curr,result;
    for(var i=0,l=paraArr.length; i<l; i++)
    {
        curr = paraArr[i].split('=');
        paraObj[curr[0]] = curr[1];            
    };        
    result = {
        
        path     : path,
        params   : paraObj,
        hash     : hash,
        addPara  : function( key,value ){ this.params[key] = value;return this; },
        delPara  : function( key ){ delete this.params[key]; return this; },
        toString : function()
        {
            var paraArr = [],paraObj = this.params;
            for( var p in paraObj )paraArr.push( p + '=' + paraObj[p] );  
            return this.path + '?' + paraArr.join('&') + this.hash;
        }
    };
    lnk = path = params = hash = paraArr = paraObj = curr = null;
    return result;
}

//写cookies函数
function setCookie(name,value)//两个参数，一个是cookie的名子，一个是值
{
    var Days = 30; //此 cookie 将被保存 30 天
    var exp  = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() +";path=/";//path是cookie的访问路径
}
//取cookies函数  
function getCookie(name)      
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null)
        return unescape(arr[2]);
    else
        return null; 
}
//删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
} 

function addEvent( el,type,fn )
{
    if(el.addEventListener)
    {   
        el.addEventListener(type,fn,false);
    }
    else
    {
        el.attachEvent('on'+type,fn);
    }
}
/*
 表单
*/
var hasSubmit = false;
function check_form()
{ 
    if( SerIsAutomaticallyLogged == "1" )return false;
    
    if(hasSubmit)return false; 
    
    var txtUserName = $("ptname"),
    txtPassword = $('ptpwd'),
    form        = $('form'),    
    username    = trim( txtUserName.value ),
    password    = '',
    loginauto,    
    returnURL,
    hasSafeEdit  = module > 0 ;//使用控件  
    
    if( hasSafeEdit )
    {
        password = $('safe_edit').GetCodePwd(SerAppId, username);
        $('encryptFlag').value = 1;
    }
    else
    {   
        password  = txtPassword.value;
    }
    
    if( SerAutoLogin == "1" )
    {
        loginauto = $("auto_login").checked;
    }
    
    if( !checkValue( txtUserName.value,'用户名不能包含: ' ) || 
        !validateValue( txtUserName, txtUserName.getAttribute('placeholder'), '请您输入盛大通行证' )         
    ){
        return false;
    }     
    if( hasSafeEdit )
    {
        if( password == '' || password == '请输入密码' )
        {
            alert ("请您输入密码");
            $('safe_edit').focus();
            return false;
        }
    }
    else
    {
        if( ! validateValue( txtPassword, '请输入密码','请您输入密码' ) )
        {
            return false;
        }
    }
    
    if(loginauto){
        $("autoLogin").value = "1";//选择了自动登录
        setCookie("autologinuser", username); 
    }else{
        $("autoLogin").value = "0";//没有选择自动登录
        delCookie("autologinuser"); 
    }
    
    $('username').value = username;
    $('password').value = password;
    
    hasSubmit = true;
    
    returnURL = escape( SerReturnURL );
    
    if( SerReturnURL )
    {
        var patrn=/^https?:\/\/([a-zA-Z.-]+\.)?(speedup|hd|so|mv|zone)\.ku6\.com(\/.+)?$/ig; 
        if (patrn.exec( SerReturnURL )!=null){
            form.target = "_blank";
            parent.close();
        }
        if(SerReturnURL.indexOf("ktv.ku6.com")>0){
            form.target = "_blank";
            txtUserName.value="";
            txtPassword.value="";
            hasSubmit = false;
        }
    }
    
    var paraexist=$("form").action.indexOf("service");
    if(paraexist<=0)
    {           
        form.action = addPara( form.action,"service",returnURL );
    }

     try{
        document.charset = "GB2312";
    }catch(ex){}
    if(loginauto){
        setTimeout(function()
        {
            form.submit();
        }, 500);
    }else{
        form.submit();
    }
}

function submit_form(evt){
    evt = window.event ? window.event : evt;
    if (evt.keyCode==13){check_form();}
}

function goToRegister(){      
    var  url = '';
    try{
        if( SerRegParam.length>0 )  
            url = "http://register.sdo.com/?"+SerRegParam+"&from="+sAppId ;
        else 
            url = "http://register.sdo.com/?from="+sAppId; 
        
        window.open( url );
    }catch(e){}
}
function autoLoginWaring(e){
    if(e.checked == true) {
        var r="0";
        if(SerAutologinWarntext){
            r=confirm(SerAutologinWarntext);
        }
        if(r){
            e.checked = true;
        }else{
            e.checked =false;
        }
        return false;
    }
}
function pageInit()
{  
    if(SerMsg){
        alert(SerMsg);
    }
    var form    = $('form'),
    usernameTip = $('usernameTip'),
    ptname      = $('ptname'),
    ptpwd       = $('ptpwd');
    if( SerAppId != "10" ){
        /*$("ptname").focus();*/ 
    }else{
        if( SerAppId == "10" && getCookie('CAS_LOGIN_STATE') == "1" )
        {
            location = SerWebCas;
            return;
        } 
        $('btn_reg').href = "http://www.qidian.com/reg/regpre.aspx";
        $('btn_forget_pwd').href = "http://pwd.sdo.com/PTInfo/SafeCenter/GetPwd/ChgPwdStepInputAcc.aspx?pwdchoose=findpwd"; 
    }
     
    if( SerIsAutomaticallyLogged == "1" )
    {
        if( SerAutoLoginWaitingMsg )
        {
            ptname.value = getCookie('autologinuser');
            ptname.disabled = true; //insert username & disable
            ptpwd.value = '123456789';  //disable
            ptpwd.disabled = true;  //disable 
        } 
        $("code").value="5";
        $("autoLogin").value="1";
        $("password").value = getCookie('CAS_AUTO_LOGIN') || '';
        delCookie("CAS_AUTO_LOGIN");
        form.action = SerWEBSSO;
        form.submit();       
    } 
    
    if( usernameTip )
    {
        addEvent( ptname,'focus',function()
        { 
            usernameTip.style.display = 'block';            
        });
        addEvent( ptname,'blur',function()
        { 
            usernameTip.style.display = 'none';
        });
    }
    form.onsubmit = function(){return false;}
    document.onkeydown = submit_form;
}
function reportPagePref( url )
{
        if( /^https:/.test(url) )return;
        var p = PagePerformance, cp = {};
        cp.bgStart = p.bgStart;
        cp.bgStart_bgEnd = p.bgEnd - p.bgStart;
        cp.contentLoaded = p.contentLoaded;
        cp.contentLoaded_headStart = p.headStart - p.contentLoaded;
        cp.headStart_bodyStart = p.bodyStart - p.headStart;
        cp.bodyStart_bodyEnd   = p.bodyEnd - p.bodyStart;
        cp.bodyEnd_onloadStart = p.onloadStart - p.bodyEnd;
        cp.onloadStart_onloadEnd   = p.onloadEnd - p.onloadStart; 
        cp.type = 'php';
        var params    = [];
        for( var i in cp) 
            params.push( i + '=' + cp[i] );
        new Image().src =  url + '?' + params.join('&') + '&rand=' + Math.random();    
};

//安全控件
var timerHandle = 0,
temp, 
module = -1; 
function insertSafeEditCtrl(m) {      
   
    var pwdInputHtml = '<div id="safe_edit_msg" class="safe_edit_msg inputtxt"><a  style="margin-left:2px;color:#08f;font-size:12px;text-decoration:none" href="'+ SerDownload +'">点击下载安全控件</a></div>',
    $ocx = '<object id="safe_edit" class="safe_edit inputtxt" classid="clsid:95EBED07-1FB6-4F43-983C-8183E1FBAC6F" vspace="0" hspace="0" tabindex="3" codebase="' + SerCodeBase + '" ></object>';
    if(m == -1) {
        try{
            $('safe_edit').removeAttribute('tabindex');
        }catch(e){}
    }
    if( SerSafeEdit == "1" )
    {          
        if(m == 0) {
            $('safe_edit_input').innerHTML = $ocx;
            try{
                $('user_pwd_input').innerHTML = pwdInputHtml;
                $('safe_edit').width = '0';
                $('safe_edit').height = '0';
                $('safe_edit_input').innerHTML = $ocx;
                $('safe_edit_input').style.display = 'block';
            }catch(e){
                $('user_pwd_input').innerHTML = pwdInputHtml;
            }
        }
        if(m == 1) {
            $('safe_edit_input').innerHTML = $ocx;
            try{
                $('user_pwd_input').innerHTML = '';
                $('safe_edit_input').innerHTML = $ocx;
                $('safe_edit_input').style.display = 'block';
            }catch(e){}
        }
    }
    else
    {
        module = -1;
    } 
}

function checkSafeEdit()
{
    try {
        var newObj = new ActiveXObject("SAFEEDIT.SafeEditCtrl.1");
        if (newObj == undefined) {
            module = 0; //是IE但是没有安装
        } else {
            module = 1; //哈哈，成功
        }
    } 
    catch (e) {
        module = 0;
    }
}
function checkBrowse() {
    temp = module;
    // Internet Explorer
    try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        checkSafeEdit();
    } catch (e) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            checkSafeEdit();
        } catch (e) {
            module = -1;    //非trident 核心的浏览器
        }
    }
    if(temp != module) insertSafeEditCtrl(module);
    if (module == 1) {
        clearTimeout(timerHandle);
    } else {
        timerHandle = setTimeout(checkBrowse, 700);
    }
}
pageInit(); 
checkBrowse();

