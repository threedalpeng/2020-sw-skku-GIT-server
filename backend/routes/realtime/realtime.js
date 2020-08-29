const {
    PythonShell
} = require('python-shell');

function processStream(stream) {
    return new Promise((resolve, reject) => {
        stream.total_people = stream.mask_weared + stream.mask_off + stream.mask_incorrect + stream.mask_unknown;
        stream.mask_off = stream.mask_off + stream.mask_incorrect;
        stream.img = stream.img.toString("base64");
        resolve(stream);
    })
}

let python_process = null;

function switchPythonProcess() {
    ;
}

module.exports = {
    processStream
};