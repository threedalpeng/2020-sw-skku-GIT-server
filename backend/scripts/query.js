const models = require("../models");
const moment = require("moment");
const {
    Op
} = require("sequelize");

async function testFunc() {

    const admin_user = await models.user.findOne({
        raw: true,
        where: {
            email: "admin@admin.com"
        }
    });

    console.log(admin_user);
    await models.camera.create({
        location: "Lounge",
        mode: "video",
        access_path: "/home/seungho/darknet/2020-sw-skku-GIT/video/test_0803_03.mp4",
        room_size: 64,
        distance_criteria: 1,
        proper_n_people: 11,
        user_id: admin_user.id,
        alarm_by_email: true,
        alarm_criteria: 60,
        blurring: true
    });
}
// testFunc();

async function testFunc2() {
    let now = moment();

    await models.time_data.findOrCreate({
        where: {
            [Op.and]: [{
                captured_date: now.format("YYYY-MM-DD")
            }, {
                captured_time: {
                    [Op.startsWith]: now.format("hh:mm")
                }
            }]
        },
        defaults: {
            camera_id: 1,
            captured_date: now.format("YYYY-MM-DD"),
            captured_time: now.format("hh:mm:ss"),
            n_people: 5,
            mask_weared: 3,
            mask_off: 1,
            mask_incorrect: 0,
            mask_unknown: 1,
            risk: 20,
            congestion: 40
        }
    });
};

async function testFunc3() {
    models.hourly_data.update({
        risk: 0
    }, {
        where: {
            id: 24
        }
    });
}

async function putSampleStats() {
    const data = {
        avg_people: [],
        max_people: [],
        congestion: [],
        risk: []
    }
    let sampleDate = moment("2020-02-01 00:00");
    for (let i = 0; i < 24 * 7; i++) {
        console.log(sampleDate);
        await models.hourly_data.create({
            camera_id: 2,
            analyzed_date: sampleDate.format("YYYY-MM-DD"),
            analyzed_time: sampleDate.format("HH:mm"),
            avg_people: data.avg_people[i],
            max_people: data.max_people[i],
            congestion: data.congestion[i],
            risk: data.risk[i]
        });
        sampleDate.add(1, 'h');
    }
}
// putSampleStats();

async function checkAllAlerts() {
    const now = moment('2020-10-28 23:59:00');
    let curSearchTime = moment("2020-10-01 09:00:00");
    let camera_id = 3;
    let alert_crit = await models.camera.findByPk(camera_id, {
        attributes: ['alarm_criteria']
    });
    alert_crit = alert_crit.alarm_criteria;
    while (curSearchTime < now) {
        console.log(curSearchTime.format("YYYY-MM-DD HH:mm:00"));
        let beg_time = moment(curSearchTime).subtract(5, 'minutes');
        let data_last_five_minutes = await models.minutely_data.findAll({
            raw: true,
            logging: false,
            where: {
                camera_id: camera_id,
                analyzed_time: {
                    [Op.gte]: beg_time.format("YYYY-MM-DD HH:mm:00"),
                    [Op.lte]: curSearchTime.format("YYYY-MM-DD HH:mm:00")
                }
            },
            attributes: ['risk', 'congestion']
        });

        if (data_last_five_minutes.length < 5) {
            curSearchTime.add(1, 'minutes');
            continue;
        }

        let total_risk = 0;
        let total_congestion = 0;
        for (let i = 0; i < 5; i++) {
            total_risk += data_last_five_minutes[i].risk;
            total_congestion += data_last_five_minutes[i].congestion;
        }

        if (total_congestion >= alert_crit * 5 || total_risk >= alert_crit * 5) {
            await models.minutely_data.update({
                alert_checked: true
            }, {
                where: {
                    camera_id: camera_id,
                    analyzed_time: curSearchTime.format("YYYY-MM-DD HH:mm:00")
                }
            });
            // DO ALERT!!
            console.log("ALERT!!");
            curSearchTime.add(5, 'minutes');
        }
        curSearchTime.add(1, 'minutes');
        if (curSearchTime.format("HH:mm:00") == '00:05:00')
            curSearchTime.add(9, 'hours');
    }
}
// checkAllAlerts();

function ttoh(time) {
    return (time.substr(11, 2));
}

function remainUpToHourUnit(time) {
    return time.substr(0, 13) + ":00:00";
}

async function testFunc4() {
    for (let cid = 1; cid <= 3; cid++) {
        let cur_prc_date = moment("2020-10-01 00:00:00");
        for (let i = 0; i < 28; i++) {
            let cur_prc_hour = moment(cur_prc_date);

            let one_day_data = await models.minutely_data.findAll({
                where: {
                    camera_id: cid,
                    analyzed_time: {
                        [Op.startsWith]: cur_prc_date.format("YYYY-MM-DD")
                    }
                },
                order: [
                    ['analyzed_time', 'ASC']
                ],
                raw: true
            });

            let hr_cnt_data = 0;
            let hr_avg_people = 0;
            let hr_max_people = 0;
            let hr_avg_risk = 0;
            let hr_max_risk = 0;
            let hr_avg_congestion = 0;
            let hr_max_congestion = 0;
            let hr_cnt_alert = 0;

            let dy_cnt_data = one_day_data.length;
            let dy_avg_people = 0;
            let dy_max_people = 0;
            let dy_avg_risk = 0;
            let dy_max_risk = 0;
            let dy_avg_congestion = 0;
            let dy_max_congestion = 0;
            let dy_cnt_alert = 0;

            for (let j = 0; j < one_day_data.length; j++) {
                let data_hour = ttoh(one_day_data[j].analyzed_time);
                while (data_hour > cur_prc_hour.format("HH")) {
                    if (hr_cnt_data != 0) {
                        hr_avg_risk /= hr_cnt_data;
                        hr_avg_congestion /= hr_cnt_data;
                        hr_avg_people /= hr_cnt_data;

                        await models.hourly_data.findOrCreate({
                            where: {
                                camera_id: cid,
                                analyzed_time: cur_prc_hour.format("YYYY-MM-DD HH:00:00")
                            },
                            defaults: {
                                avg_risk: hr_avg_risk,
                                max_risk: hr_max_risk,
                                avg_congestion: hr_avg_congestion,
                                max_congestion: hr_max_congestion,
                                avg_people: hr_avg_people,
                                max_people: hr_max_people,
                                alert_count: hr_cnt_alert,
                                data_count: hr_cnt_data
                            }
                        });
                        //console.log(['hour', cur_prc_hour.format("YYYY-MM-DD HH:00:00"), hr_risk, hr_congestion]);

                    }

                    hr_avg_risk = 0;
                    hr_max_risk = 0;
                    hr_avg_congestion = 0;
                    hr_max_congestion = 0;
                    hr_avg_people = 0;
                    hr_max_people = 0;
                    hr_cnt_alert = 0;

                    cur_prc_hour.add(1, 'hours');
                    hr_cnt_data = 0;
                }

                ++hr_cnt_data;

                hr_avg_people += one_day_data[j].n_people;
                if (hr_max_people < one_day_data[j].n_people) {
                    hr_max_people = one_day_data[j].n_people;
                }

                hr_avg_risk += one_day_data[j].risk;
                if (hr_max_risk < one_day_data[j].risk) {
                    hr_max_risk = one_day_data[j].risk;
                }
                hr_avg_congestion += one_day_data[j].congestion;
                if (hr_max_congestion < one_day_data[j].congestion) {
                    hr_max_congestion = one_day_data[j].congestion;
                }

                if (one_day_data[j].alert_checked) {
                    ++hr_cnt_alert;
                }

                dy_avg_people += one_day_data[j].n_people;
                if (dy_max_people < one_day_data[j].n_people) {
                    dy_max_people = one_day_data[j].n_people;
                }
                dy_avg_risk += one_day_data[j].risk;
                if (dy_max_risk < one_day_data[j].risk) {
                    dy_max_risk = one_day_data[j].risk;
                }
                dy_avg_congestion += one_day_data[j].congestion;
                if (dy_max_congestion < one_day_data[j].congestion) {
                    dy_max_congestion = one_day_data[j].congestion;
                }
                if (one_day_data[j].alert_checked) {
                    ++dy_cnt_alert;
                }
            }

            if (hr_cnt_data != 0) {
                hr_avg_risk /= hr_cnt_data;
                hr_avg_congestion /= hr_cnt_data;
                hr_avg_people /= hr_cnt_data;

                await models.hourly_data.findOrCreate({
                    where: {
                        camera_id: cid,
                        analyzed_time: cur_prc_hour.format("YYYY-MM-DD HH:00:00")
                    },
                    defaults: {
                        avg_risk: hr_avg_risk,
                        max_risk: hr_max_risk,
                        avg_congestion: hr_avg_congestion,
                        max_congestion: hr_max_congestion,
                        avg_people: hr_avg_people,
                        max_people: hr_max_people,
                        alert_count: hr_cnt_alert,
                        data_count: hr_cnt_data
                    }
                });
                //console.log(['hour', cur_prc_hour.format("YYYY-MM-DD HH:00:00"), hr_risk, hr_congestion]);
            }


            if (dy_cnt_data != 0) {
                dy_avg_risk /= dy_cnt_data;
                dy_avg_congestion /= dy_cnt_data;
                dy_avg_people /= dy_cnt_data;

                console.log(dy_cnt_alert);
                let safety_score = (10 - (0.04 * dy_avg_congestion + 0.06 * dy_avg_risk));

                await models.daily_data.findOrCreate({
                    where: {
                        camera_id: cid,
                        analyzed_time: cur_prc_date.format("YYYY-MM-DD")
                    },
                    defaults: {
                        avg_risk: dy_avg_risk,
                        max_risk: dy_max_risk,
                        avg_congestion: dy_avg_congestion,
                        max_congestion: dy_max_congestion,
                        avg_people: dy_avg_people,
                        max_people: dy_max_people,
                        alert_count: dy_cnt_alert,
                        safety_score: safety_score,
                        data_count: dy_cnt_data
                    }
                });
                //console.log(['day', cur_prc_date.format("YYYY-MM-DD"), dy_risk, dy_congestion, (10 - (0.04 * dy_congestion + 0.06 * dy_risk))]);
            }

            cur_prc_date.add(1, 'days');
        }
    }
}
testFunc4();