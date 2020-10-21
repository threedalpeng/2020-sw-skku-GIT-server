const {
    PythonShell
} = require('python-shell');
const models = require('../../models');
const shell = require('shelljs');
const config = require('../../config/config.json');
const Camera = require('../../class/Camera');
const {
    io
} = require('../../scripts/socket');

let camera_map = new Map();

function processStream(stream) {
    return new Promise((resolve, reject) => {
        stream.total_people = stream.mask_weared + stream.mask_off + stream.mask_incorrect + stream.mask_unknown;
        if (stream.risk > 100)
            stream.risk = 100
        if (stream.congestion > 100)
            stream.congestion = 100
        if (camera_map.has(stream.camera_id))
            camera_map.get(stream.camera_id).countRealtimeData(stream);
        stream.mask_off = stream.mask_off + stream.mask_incorrect;
        stream.img = stream.img.toString("base64");
        resolve(stream);
    });
}

async function initCameras(res, req) {
    const list_of_cams = await models.camera.findAll({
        raw: true,
        where: {
            user_id: 1
        },
        attributes: ['id', 'mode']
    });
    for (let i = 0; i < list_of_cams.length; i++) {
        const cam = list_of_cams[i];
        let cam_obj;
        if (camera_map.has(cam.id))
            cam_obj = camera_map.get(cam.id);
        else
            cam_obj = createCameraById(cam.id);
        if (cam.id == 1) {
            cam_obj.runProcess();
        }
    }
}

/*
async function initLiveProcesses(res, req) {
    const list_of_live_cams = await models.camera.findAll({
        raw: true,
        where: {
            user_id: 1,
            mode: 'live'
        }
    });
    for (let i = 0; i < list_of_live_cams.length; i++) {
        const cam = list_of_live_cams[i];
        createCameraById(cam.id).runProcess();
    }
}
*/

function createCameraById(cam_id) {
    let cam = new Camera(cam_id, io);
    camera_map.set(cam_id, cam);
    return cam;
}

function runProcess(cam_id) {
    killAllProcesses();
    camera_map.get(cam_id).runProcess();
}

async function checkVideoProcessesById(cam_id) {
    const video = await models.camera.findOne({
        raw: true,
        where: {
            id: cam_id
        },
        attributes: ['mode']
    });

    if (video.mode == 'video') {
        camera_map.get(cam_id).runProcess();
    }
}

async function killAllProcesses(res, req) {
    for (let camera of camera_map.values()) {
        await camera.killProcess();
    }
    shell.exec(config.path.shell + 'kill_preventra.sh');
}

module.exports = {
    processStream,
    initCameras,
    killAllProcesses,
    checkVideoProcessesById,
    runProcess
};