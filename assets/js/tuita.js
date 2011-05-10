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

tuita.parse = function(feed) {
    debug("parse:"+JSON.stringify(feed));
};

tuita.render = function(feeds) {
    debug("render:"+feeds);
    for (i in feeds) {
        var feed = feeds[i];
        tuita.parse(feed);
    }
};

var test = (function() {
})();

function after_load_tuita(res) {
    var reg_avatar = /background:url\(.*\)/i;
    var result_avatar = reg_avatar.exec(res);
    debug(result_avatar);
    x$('p[class=avatar]').attr('style',result_avatar);

    var reg_render = /tuita.render\(.*\);/
    var render = reg_render.exec(res);
    debug(render);
    feeds = render.toString().replace('tuita\.render(','').replace(');','');
    debug(feeds);
    tuita.render(feeds);
};


