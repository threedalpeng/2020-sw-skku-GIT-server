const models = require('../../models');
const moment = require('moment');
const {
    Op
} = require('sequelize');

function ttoh(time) {
    return new Promise((resolve) => {
        let time_list = time.split(":", 1);
        resolve(time_list[0] + ':00');
    })
}

async function createHourlyDataFromTimeData() {
    //var fs = require('fs');
    let time_to_find = moment().subtract(1, 'h');
    let cap_date = time_to_find.format("YYYY-MM-DD HH:mm:00");
    const minutely_data = await models.minutely_data.findAll({
        raw: true,
        attributes: ['camera_id', 'analyzed_time', 'n_people', 'risk', 'congestion', 'alert_checked'],
        order: [
            ['camera_id', 'ASC'],
            ['captured_time', 'ASC']
        ],
        where: {
            analyzed_time: cap_date
        }
    });
    let cam_id = minutely_data[0].camera_id,
        hour,
        avg_people = 0,
        max_people = 0,
        count = 0,
        risk = 0,
        congestion = 0,
        cnt_alert = 0;
    
    for (let i = 0; i < time_data.length; i++) {
        hour = await ttoh(time_data[i].captured_time);
        if (cam_id !== time_data[i].camera_id) {
            // Save compressed data into hourly_data table
            if (count == 0) {
                risk = 0;
                congestion = 0;
                avg_people = 0;
                cnt_alert = 0;
            } else {
                risk /= count;
                congestion /= count;
                avg_people /= count;
            }

            //data += (cam_id + ", " + cap_date + ", " + cap_time + ", " + risk + ", " + congestion + ", " + avg_people + ", " + max_people + '\n');

            await models.hourly_data.findOrCreate({
                where: {
                    camera_id: cam_id,
                    analyzed_date: cap_date,
                    analyzed_time: cap_time
                },
                defaults: {
                    risk: risk,
                    congestion: congestion,
                    avg_people: avg_people,
                    max_people: max_people,
                    alarm_count: cnt_alert
                }
            });

            cam_id = time_data[i].camera_id;
            cap_date = time_data[i].captured_date;
            cap_time = hour;
            risk = 0;
            congestion = 0;
            avg_people = 0;
            max_people = 0;
            cnt_alert = 0;
            count = 0;
        }

        risk += time_data[i].risk;
        congestion += time_data[i].congestion;
        avg_people += time_data[i].n_people;
        if (max_people < time_data[i].n_people) {
            max_people = time_data[i].n_people;
        }
        if (time_data[i].alert_checked) {
            cnt_alert += 1;
        }
        count += 1;
    }

    if (count == 0) {
        risk = 0;
        congestion = 0;
        avg_people = 0;
    } else {
        risk /= count;
        congestion /= count;
        avg_people /= count;
    }

    //data += (cam_id + ", " + cap_date + ", " + cap_time + ", " + risk + ", " + congestion + ", " + avg_people + ", " + max_people + '\n');
    //console.log([cam_id, cap_date, cap_time, risk, congestion, avg_people, max_people]);

    await models.hourly_data.findOrCreate({
        where: {
            camera_id: cam_id,
            analyzed_date: cap_date,
            analyzed_time: cap_time
        },
        defaults: {
            risk: risk,
            congestion: congestion,
            avg_people: avg_people,
            max_people: max_people,
            alarm_count: cnt_alert
        }
    });

    //fs.writeFileSync("test.txt", data, "utf8");

    /*
    await models.time_data.destroy({
        truncate: true
    });
    */


}

createHourlyDataFromTimeData();