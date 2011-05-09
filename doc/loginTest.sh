#!/bin/bash

username=$1
password=$2
other="templateId=&sdid=&infoEx=&uid=&appArea=0&appId=256&service=http%3A//www.tuita.com/login%3Frefer
%3D&code=2&pageType=0&autoLogin=&saveTime=14&loginCustomerUrl=http%3A//www.tuita.com/login&encryptFlag=0"
url="https://dplogin.sdo.com/dispatchlogin.fcgi"


curl -v --data "usernmae=$username&password=$password&$other" $url -o login.response

iconv -f gb2312 -t utf8 login.response
