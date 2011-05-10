var release = true;
var log = '';
function debug(msg) {
    if (config.debug) {
        if (release)
            log += msg + '\n'; //TODO: add send log
        else
            alert('debug:\n'+msg);
    }
};


