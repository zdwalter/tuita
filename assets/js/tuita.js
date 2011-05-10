var theData = new Lawnchair({adaptor:'dom'});

function go_home() {
    load_tuita();
    display('#home');
};

function load_tuita() {
   ajax_handler = $.ajax({
        url: 'http://www.tuita.com/',
        headers: { Cookie: login.tuita_cookie},
        type: 'get',
        success: after_load_tuita
        });
};
var tuita = {};

var types = {
    1: 'post',
    2: '2',
    7: 'repost',
    21: 'unknown'
};

tuita.parse = function(feed) {
    try {
        var typeid = feed.typeid;
        var type = types[typeid];

        var div = '<div>';
        var avatar = feed.sdid;
        var content = feed.content;
        if (type == 'post') {
            var poster = content.sdid;
            var post_content = content.post_content;
            var post_type = type.post_type; //tuita, reblog
            var summary = post_content.summary;
            var post = 
                  '<div class="feed_group">'
                +   '<div class="feed">'
                +     '<p class="cell_user_info">' + avatar.blog_title + '</p>'
                +     '<div>' + summary + '</div>'
                +   '</div>'
                + '</div>';
            div += post;
        };

        div += '</div>';
        x$('article#feedBlocks').bottom(div);
    }
    catch(e) {
        on_error(e);
    }
};

tuita.render = function(feeds) {
    if (feeds.length) {
        x$('article#feedBlocks').inner('');
    }
    for (i in feeds) {
        var feed = feeds[i];
        tuita.parse(feed);
    }
};

function after_load_tuita(res) {
    var reg_avatar = /background:url\(.*\)/i;
    var result_avatar = reg_avatar.exec(res);
    debug(result_avatar);
    x$('p[class=avatar]').attr('style',result_avatar);

    //TODO user info
    var reg_render = /tuita.render\(.*\);/
    var render = reg_render.exec(res);
    feeds = render.toString().replace('tuita\.render(','').replace(');','');
    tuita.render(eval(feeds));
};


var test = (function() {
    var feed = {"sdid":    {"avatar_thumb_big":"http:\/\/ft.staticsdo.com\/bf\/dd\/1011627165\/64x64.jpg?1","avatar_thumb_small":"http:\/\/ft.staticsdo.com\/bf\/dd\/1011627165\/20x20.jpg?1",            "prime_blog_id":"1011627165","full_domain":"ooooo.tuita.com","blog_title":"\u8499\u8499","sdid":1011627165}
    ,"appid":10001,"typeid":7,"fid":"02000000000138f80000012fd815a925","time":1305000388901,
    "content":
    {"post_id":"35566",
    "sdid":
    {"avatar_thumb_big":"http:\/\/ft.staticsdo.com\/d1\/87\/1546495719\/64x64.jpg?1","avatar_thumb_small":"http:\/\/ft.staticsdo.com\/d1\/87\/1546495719\/20x20.jpg?1",        "prime_blog_id":"1546495719","full_domain":"simonyang2008.tuita.com","blog_title":"\u6768\u5c11\u5f6c","sdid":"1546495719"}
    ,"post_author":"1011627165","post_title":"","post_type":"reblog","post_tag":"","post_blog":"1011627165","post_content":
    {"reblog_id":"35559","reblog_text":"\u5e2e\u8f6c\u3001\u3001","reblog_body":
    {"post_id":"35559","post_author":"1546495719","post_title":"\u8d21\u732e3\u679a\u63a8\u4ed6\u9080\u8bf7\u7801","post_type":"blog","post_tag":"\u9080\u8bf7\u7801",     "post_blog":"1546495719","post_content":
    {"summary":"\u5728\u63a8\u4ed6\u6536\u83b7\u4e863\u679a\u9080\u8bf7\u7801\uff0c\u53cb\u60c5\u8d60\u9001\uff1ahttp:\/\/www.tuita.com\/invite\/DQlGUjPyhttp:\/\/www.tuita.com\/invite\/wp898ugxhttp:\/\/www.tuita.com\/invite\/zwcHmAab","suInfo":false,"suImg":false,"suHtml":                                                                        
    "<div>\u5728\u63a8\u4ed6\u6536\u83b7\u4e863\u679a\u9080\u8bf7\u7801\uff0c\u53cb\u60c5\u8d60\u9001\uff1a<\/div><div>http:\/\/www.tuita.com\/invite\/DQlGUjPy<\/div><div>http:\/\/   www.tuita.com\/invite\/wp898ugx<\/div><div>http:\/\/www.tuita.com\/invite\/zwcHmAab<\/div>","body":                                                                                
    "<div>\u5728\u63a8\u4ed6\u6536\u83b7\u4e863\u679a\u9080\u8bf7\u7801\uff0c\u53cb\u60c5\u8d60\u9001\uff1a<\/div><div>http:\/\/www.tuita.com\/invite\/DQlGUjPy<\/div><div>http:\/\/www.tuita.com\/invite\/wp898ugx<\/div><div>http:\/\/www.tuita.com\/invite\/zwcHmAab<\/div>"}
    ,"post_time":1305000318,"post_source":"web","post_ip":3683507026}
    }        ,"post_time":1305000388,"post_source":"web","post_ip":1996904574,"stat":        {"post_forward":0,"post_collection":0,"post_comment":0}        ,"like_flag":false}};

    var feed_1 = {"sdid":
{"avatar_thumb_big":"http:\/\/ft.staticsdo.com\/49\/49\/1534645712\/64x64.jpg?2","avatar_thumb_small":"http:\/\/ft.staticsdo.com\/49\/49\/1534645712\/20x20.jpg?2",            "prime_blog_id":"1534645712","full_domain":"smilodon.tuita.com","blog_title":"\u84dd\u7ffc","sdid":1534645712}
    ,"appid":10001,"typeid":1,"fid":"02000000000137ef0000012fd7beedfc","time":1304994704892,"content":
        {"post_id":"35048","sdid":"","post_author":"1534645712","post_title":"","post_type":"tuita","post_tag":"","post_blog":"1534645712","post_content":
                {"summary":"\u5565\u65f6\u5019\u80fd\u6709\u5220\u8bc4\u8bba\u7684\u529f\u80fd\uff1f","body":"\u5565\u65f6\u5019\u80fd\u6709\u5220\u8bc4\u8bba\u7684\u529f\u80fd\uff1f"}
                        ,"post_time":1304994704,"post_source":"web","post_ip":1917879559,"stat":
                                {"post_forward":0,"post_collection":0,"post_comment":2}
                                        ,"like_flag":false}
};

    //tuita.parse(feed_1);

})();
