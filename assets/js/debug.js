var release = true;
var log = '';
var step = 0;
function debug(msg) {
    log = "\n"+ step + ":" + msg; 
    step += 1;
};

function show_log() {
    alert('callstack:\n'+log);
    log = '';
};

