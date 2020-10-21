const models = require('../../models');

async function getCameraSettings(req, res) {
    const current_settings = await models.camera.findOne({
        raw: true,
        attributes: [
            ['id', 'camera_id'], 'room_size', 'distance_criteria', 'proper_n_people', 'alarm_by_email', 'alarm_criteria', 'access_path', 'blurring', 'location'
        ],
        where: {
            id: req.params.id
        }
    });
    res.send(current_settings);
}

async function saveCameraSettings(req, res) {
    let new_settings = req.body;
    switch (+new_settings.alarm_criteria) {
        case 1:
            new_settings.alarm_criteria = 40;
            break;
        case 2:
            new_settings.alarm_criteria = 60;
            break;
        case 3:
            new_settings.alarm_criteria = 80;
            break;
    }
    console.log(new_settings);
    models.camera.update({
        room_size: new_settings.room_size,
        distance_criteria: new_settings.distance_criteria,
        proper_n_people: new_settings.proper_n_people,
        alarm_by_email: new_settings.alarm_by_email,
        alarm_criteria: new_settings.alarm_criteria,
        access_path: new_settings.access_path,
        blurring: new_settings.blurring,
        location: new_settings.location
    }, {
        where: {
            id: new_settings.camera_id
        }
    });
    res.end();
}

module.exports = {
    getCameraSettings,
    saveCameraSettings
}