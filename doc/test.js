//var fs = require("fs");
//var html = fs.readFileSync("tuita.index.html");

var jsdom = require("jsdom");
jsdom.env("tuita.index.html", [
    'http://code.jquery.com/jquery-1.5.min.js'
    ], function(errors, window) {
    var $ = window.$;

    console.log('avatar', $('a').attr('href'));
    $('a').each(function() {
        console.log('-', $(this).html());
        console.log('-', $(this).text());
        console.log('-', $(this).attr('href'));
    });
});

