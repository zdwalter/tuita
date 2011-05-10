// put this last js include
var is_init = false;
var init = (function () {
    if (is_init)
        return;
    is_init = true;

    alert('init'); 
    store_load();
    test_login();
    //navigator.network.isReachable("tuita.com", function(status) {
    //	var connectivity = (status.internetConnectionStatus || status.code || status);
    //	if (connectivity === NetworkStatus.NOT_REACHABLE) {
    //		alert("No internet connection");
    //        is_online = false;
    //	} else {
    //		//alert("We can reach Tuita!");
    //        is_online = true;
    //	}
    //});
    when('#welcome');
    when('#home', function() {
        alert('home');
    });
    when('#logout', function() {
        alert('not support yet');
    });
    when('#login', function() {
    });
    when('#settings', function() {
		// load settings from store and make sure we persist radio buttons.
		store.get('config', function(saved) {
			if (saved) {
				if (saved.map) {
					x$('input[value=' + saved.map + ']').attr('checked',true);
				}
				if (saved.zoom) {
					x$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked',true);
				}
			}
		});
	});
    when('#map', function () {
        store.get('config', function (saved) {
            // construct a gmap str
            var map  = saved ? saved.map || ui('map') : ui('map')
            ,   zoom = saved ? saved.zoom || ui('zoom') : ui('zoom')
            ,   path = "http://maps.google.com/maps/api/staticmap?center=";
			
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = "" + position.coords.latitude + "," + position.coords.longitude;
                path += location + "&zoom=" + zoom;
                path += "&size=250x250&maptype=" + map + "&markers=color:red|label:P|";
                path += location + "&sensor=false";

                x$('img#static_map').attr('src', path);
            }, function () {
                x$('img#static_map').attr('src', "assets/img/gpsfailed.png");
            });
        });
    });
    when('#save', function () {
        store.save({
            key:'config',
            map:ui('map'),
            zoom:ui('zoom')
        });
        display('#welcome');
    });

})();

