var release = true;
var log = '';
var step = 0;
function debug(msg) {
    log = step + ":" + msg + '\n' + log;  
    step += 1;
};

function show_log() {
    alert('callstack:\n'+log);
    log = '';
};

function on_error(msg) {
    debug('error:\n'+JSON.stringify(msg));
    show_log();
};


