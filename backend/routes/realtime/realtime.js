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

let option = {
    scriptPath: "/home/seungho/darknet/2020-sw-skku-GIT/",
    args: ["/home/seungho/darknet/2020-sw-skku-GIT/"]
}
let python_process = null;
let process_type = "stream";

function switchPythonProcess() {
    return new Promise((resolve, reject) => {
        if (python_process === null) {
            PythonShell.defaultOptions = option;
            process_type = "stream"
        } else {
            python_process.kill('SIGINT');
            if (process_type === "stream") {
                process_type = "video";
            } else if (process_type === "video") {
                process_type = "stream";
            }
        }

        if (process_type === "stream") {
            let pyshell = new PythonShell('PreVentra_ver2.py', option);
            python_process = pyshell.childProcess;
        } else if (process_type === "video") {
            let pyshell = new PythonShell('PreVentra_ver2_video.py', option);
            python_process = pyshell.childProcess;
        }
        resolve(process_type);
    });
}

function killPythonProcess() {
    if (python_process !== null) {
        python_process.kill('SIGINT');
        python_process = null;
    }
}

module.exports = {
    processStream,
    switchPythonProcess,
    killPythonProcess
};