var theData = new Lawnchair({adaptor:'dom'});

function go_home() {
    load_tuita();
};

function load_tuita() {
    debug("load_tuite:");
    ajax_handler = $.ajax({
        url: generate_portal_url('http://www.tuita.com/'),
        headers: generate_portal_cookie( login.tuita_cookie ),
        type: 'get',
        success: after_load_tuita,
        error: on_login_error
        });
};
var tuita = {};

var types = {
    1: 'tuita',
    2: 'blog',
    4: 'photoset',
    7: 'reblog',
    21: 'follow.update',
    23: 'tuita.update'
};

tuita.html = function(type, post_content, avatar) {
    var post = '';
    //post += '<p>'+type +'</p>';

    if (type == 'tuita') {
        post += '<div>' + post_content.body + '</div>'
            ;
    }
    else if (type == 'blog') {
        post +='<div>' + post_content.summary + '</div>'
            ;
    }else if (type == 'photoset') {
        for (i in post_content) {
            var photo = post_content[i];
            post += '<img width="100%" src="http://photo.staticsdo.com/' + photo.photo_url + "-256." + photo.photo_type +'">';
            //post += '<p>"http://photo.staticsdo.com/' + photo.photo_url + "." + photo.photo_type +'"</p>';
        }
    } else if (type == 'reblog') {
        post += '<div>' + post_content.reblog_text+ '</div>';
        if (avatar && avatar.blog_title)
            post += '<p class="cell_user_info" >' + avatar.blog_title + '</p>';
        var reblog = post_content.reblog_body;
        post += '<div>' + tuita.html(reblog.post_type, reblog.post_content) + '</div>';
    } else {
        post += '<h2 calss="title"> ' + type +'</h2>';
        post += '<div>' + post_content.summary + '</div>';
    }
    return post;
};
tuita.parse = function(feed) {
    try {
        var typeid = feed.typeid;
        var type = types[typeid];
        if (typeid > 20)
            return;

        var div = '<div>';
        var avatar = feed.sdid;
        var content = feed.content;
        var poster = content.sdid;
        var post_content = content.post_content;
        var post_avatar = content.sdid;
        var post_type = content.post_type;
        var post = '<div class="feed_group" style="text-align: left">'
                    +  '<p class="cell_user_info" >' + avatar.blog_title + '</p>'
                    +  '<div class="content">' 
                    +    '<div class="feed">';
        if (content.post_title)
            post +=  '<h2 class="title">' + content.post_title + '</h2>';
        post += tuita.html(post_type, post_content, post_avatar);
        post    +=     '</div>'
                +   '</div>'
                + '</div>';
        div += post;

        div += '</div>';
        x$('article#feeds').bottom(div);
    }
    catch(e) {
        on_error(e);
    }
};

tuita.render = function(feeds) {
    if (feeds.length) {
        x$('article#feeds').inner('');
    }
    for (i in feeds) {
        var feed = feeds[i];
        tuita.parse(feed);
    }
};

function after_load_tuita(res) {
    debug('after_load_tuita');
    var reg_avatar = /background:url\(.*\)/i;
    var result_avatar = reg_avatar.exec(res);
    debug('avatar:'+result_avatar);
    x$('p[class=avatar]').attr('style',result_avatar);

    //TODO user info
    var reg_render = /tuita.render\(.*\);/
    var render = reg_render.exec(res);
    feeds = render.toString().replace('tuita\.render(','').replace(');','');
    debug('feeds:'+feeds);
    tuita.render(eval(feeds));
    display('#home');
};

