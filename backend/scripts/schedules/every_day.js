const models = require('../../models');

function ttoh(time) {
    return new Promise((resolve) => {
        let time_list = time.split(":", 1);
        resolve(time_list[0] + ':00');
    })
}

async function createDailyDataFromHoulryData() {
    const time_data = await models.time_data.findAll({
        raw: true,
        attributes: ['camera_id', 'captured_date', 'captured_time', 'n_people', 'risk', 'congestion'],
        order: [
            ['camera_id', 'ASC'],
            ['captured_date', 'ASC'],
            ['captured_time', 'ASC']
        ]
    });
    let cam_id = time_data[0].camera_id,
        cap_date = time_data[0].captured_date,
        cap_time = await ttoh(time_data[0].captured_time),
        hour,
        avg_people = 0,
        max_people = 0,
        count = 0,
        risk = 0,
        congestion = 0;
    for (let i = 0; i < time_data.length; i++) {
        hour = await ttoh(time_data[i].captured_time);
        if (cam_id !== time_data[i].camera_id || cap_date !== time_data[i].captured_date || cap_time !== hour) {
            // Save compressed data into hourly_data table
            if (count == 0) {
                risk = 0;
                congestion = 0;
                avg_people = 0;
            } else {
                risk /= count;
                congestion /= count;
                avg_people /= count;
            }

            console.log([cam_id, cap_date, cap_time, risk, congestion, avg_people, max_people]);
            /*
            await models.hourly_data.findOrCreate({
                where: {
                    camera_id: cam_id,
                    analyzed_date: cap_date,
                    analyzed_time: cap_time
                },
                defaults: {
                    risk: risk,
                    congestion: congestion,
                    high_risk_time: high_risk_time,
                    avg_people: avg_people,
                    max_people: max_people,
                }
            });
            */

            cam_id = time_data[i].camera_id;
            cap_date = time_data[i].captured_date;
            cap_time = hour;
            risk = 0;
            congestion = 0;
            avg_people = 0;
            max_people = 0;
            count = 0;
        }

        risk += time_data[i].risk;
        congestion += time_data[i].congestion;
        avg_people += time_data[i].n_people;
        if (max_people < time_data[i].n_people) {
            max_people = time_data[i].n_people;
        }
        count += 1;
    }

    /*
    await models.time_data.delete({
        truncate: true
    });
    */
}

createHourlyDataFromTimeData();