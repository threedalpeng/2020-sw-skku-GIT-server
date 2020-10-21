const models = require('../../models');
const config = require('../../config/config.json');
const moment = require('moment');
const {
    Op
} = require("sequelize");

function getListsPerMinute(cam_id, start_date, end_date) {
    const days_period = moment(end_date).diff(moment(start_date), 'days') + 1;
    return new Promise(async (resolve, reject)=> {
        prd_lists = {
            risks: [],
            congestions: []
        }
    
        let prd_data = await models.minutely_data.findAll({
            raw: true,
            attributes: ['analyzed_time', 'risk', 'congestion'],
            where: {
                camera_id: cam_id,
                analyzed_time: {
                    [Op.gte]: start_date + " 00:00:00",
                    [Op.lte]: end_date + " 23:59:59"
                }
            },
            order: [
                ['analyzed_time', 'ASC']
            ]
        });
    
        let cur_prc_time = moment(start_date + " 00:00:00");
        let pi = 0;
        let minutes_period = days_period * 24 * 60;
        let prd_time = '';
        if (prd_data.length != 0)
            prd_time = prd_data[pi].analyzed_time;
    
        for (let j = 0; j < minutes_period; j++) {
            if (prd_time == cur_prc_time.format('YYYY-MM-DD HH:mm:00')) {
                prd_lists.risks.push(prd_data[pi].risk);
                prd_lists.congestions.push(prd_data[pi].congestion);
                if (++pi < prd_data.length)
                    prd_time = prd_data[pi].analyzed_time;
            } else {
                prd_lists.risks.push(0);
                prd_lists.congestions.push(0);
            }
            cur_prc_time.add(1, 'minutes');
        }

        resolve(prd_lists);
    });
}

function getListsPerHour(cam_id, start_date, end_date) {
    const days_period = moment(end_date).diff(moment(start_date), 'days') + 1;
    return new Promise(async (resolve, reject)=> {
        prd_lists = {
            risks: [],
            congestions: []
        }
    
        let prd_data = await models.hourly_data.findAll({
            raw: true,
            attributes: ['analyzed_time', ['avg_risk', 'risk'], ['avg_congestion', 'congestion']],
            where: {
                camera_id: cam_id,
                analyzed_time: {
                    [Op.gte]: start_date + " 00:00:00",
                    [Op.lte]: end_date + " 23:59:59"
                }
            },
            order: [
                ['analyzed_time', 'ASC']
            ]
        });
    
        let cur_prc_time = moment(start_date + " 00:00:00");
        let pi = 0;
        let hours_period = days_period * 24;
        let prd_time = '';
        if (prd_data.length != 0)
            prd_time = prd_data[pi].analyzed_time;
    
        for (let j = 0; j < hours_period; j++) {
            if (prd_time == cur_prc_time.format('YYYY-MM-DD HH:00:00')) {
                prd_lists.risks.push(prd_data[pi].risk);
                prd_lists.congestions.push(prd_data[pi].congestion);
                if (++pi < prd_data.length)
                    prd_time = prd_data[pi].analyzed_time;
            } else {
                prd_lists.risks.push(0);
                prd_lists.congestions.push(0);
            }
            cur_prc_time.add(1, 'hours');
        }

        resolve(prd_lists);
    });
}

function getListsPerDay(cam_id, start_date, end_date) {
    const days_period = moment(end_date).diff(moment(start_date), 'days') + 1;
    return new Promise(async (resolve, reject)=> {
        prd_lists = {
            risks: [],
            congestions: []
        }
    
        let prd_data = await models.daily_data.findAll({
            raw: true,
            attributes: ['analyzed_time', ['avg_risk', 'risk'], ['avg_congestion', 'congestion']],
            where: {
                camera_id: cam_id,
                analyzed_time: {
                    [Op.gte]: start_date,
                    [Op.lte]: end_date
                }
            },
            order: [
                ['analyzed_time', 'ASC']
            ]
        });
    
        let cur_prc_time = moment(start_date + " 00:00:00");
        let pi = 0;
        let prd_time = '';
        if (prd_data.length != 0)
            prd_time = prd_data[pi].analyzed_time;
    
        for (let j = 0; j < days_period; j++) {
            if (prd_time == cur_prc_time.format('YYYY-MM-DD')) {
                prd_lists.risks.push(prd_data[pi].risk);
                prd_lists.congestions.push(prd_data[pi].congestion);
                if (++pi < prd_data.length)
                    prd_time = prd_data[pi].analyzed_time;
            } else {
                prd_lists.risks.push(0);
                prd_lists.congestions.push(0);
            }
            cur_prc_time.add(1, 'days');
        }

        resolve(prd_lists);
    });
}


async function getStatsByDate(req, res) {
    const unit = req.params.unit;
    const start_date = "" + req.params.start_date;
    const end_date = "" + req.params.end_date;
    let getLists;
    if (unit == 'minute') {
        getLists = getListsPerMinute;
    } else if (unit == 'hour') {
        getLists = getListsPerHour;
    } else if (unit == 'day') {
        getLists = getListsPerDay;
    } else {
        res.status(406).end();
    }

    const cam_list = await models.camera.findAll({
        raw: true,
        attributes: ['id', 'location', 'proper_n_people'],
        where: {
            user_id: 1
        }
    });

    const now = moment();
    const date_this_week_begins = moment(now).subtract(8, 'days').format("YYYY-MM-DD");
    const date_this_week_ends = moment(now).subtract(1, 'days').format("YYYY-MM-DD");
    const date_last_week_begins = moment(now).subtract(15, 'days').format("YYYY-MM-DD");
    const date_last_week_ends = moment(now).subtract(9, 'days').format("YYYY-MM-DD");

    let result = [];
    for (let i = 0; i < cam_list.length; i++) {
        let cam_result = {
            id: cam_list[i].id,
            location: cam_list[i].location,
            proper_n_people: cam_list[i].proper_n_people,
            today: {
                n_people: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                avg_people: 5,
                max_people: 10,
                safety_score: 5,
                prev_safety_score: 4
            },
            selected_period: {
                risks: [],
                max_risk: 0,
                avg_risk: 0,
                congestions: [],
                max_congestion: 0,
                avg_congestion: 0,
                alert_count: 5
            }
        };

        /*
         * create safety score stats
         */
        let safety_scores = await models.daily_data.findAll({
            raw: true,
            attributes: ['analyzed_time', 'safety_score'],
            where: {
                camera_id: cam_list[i].id,
                analyzed_time: {
                    [Op.gte]: date_last_week_begins,
                    [Op.lte]: date_this_week_ends
                }
            },
            order: [
                ['analyzed_time', 'ASC']
            ]
        });

        let safety_score_last_week = 0;
        let cnt_last_week = 0;
        let safety_score_this_week = 0;
        let cnt_this_week = 0;
        for (let j = 0; j < safety_scores.length; j++) {
            if (date_last_week_ends >= safety_scores[j].analyzed_time) {
                safety_score_last_week += safety_scores[j].safety_score;
                cnt_last_week++;
            } else {
                safety_score_this_week += safety_scores[j].safety_score;
                cnt_this_week++;
            }
        }
        if (cnt_this_week != 0)
            safety_score_this_week /= cnt_this_week;
        if (cnt_last_week != 0)
            safety_score_last_week /= cnt_last_week;
        cam_result.today.safety_score = Math.round(safety_score_this_week * 10) / 10;
        cam_result.today.prev_safety_score = Math.round(safety_score_last_week * 10) / 10;

        /*
         * create stats for today
         */


        /*
         * create max and avg stats for selected period
         */

        let prd_daily_data = await models.daily_data.findAll({
            raw: true,
            attributes: ['analyzed_time', 'avg_risk', 'max_risk', 'avg_congestion', 'max_congestion', 'alert_count'],
            where: {
                camera_id: cam_list[i].id,
                analyzed_time: {
                    [Op.gte]: start_date,
                    [Op.lte]: end_date
                }
            },
        });

        let prd_avg_risk = 0;
        let prd_max_risk = 0;
        let prd_avg_congestion = 0;
        let prd_max_congestion = 0;
        let prd_alert_count = 0;
        let prd_cnt = prd_daily_data.length;
        for (let j = 0; j < prd_cnt; j++) {
            prd_avg_risk += prd_daily_data[j].avg_risk;
            if (prd_max_risk < prd_daily_data[j].max_risk) {
                prd_max_risk = prd_daily_data[j].max_risk;
            }
            prd_avg_congestion += prd_daily_data[j].avg_congestion
            if (prd_max_congestion < prd_daily_data[j].max_congestion) {
                prd_max_congestion = prd_daily_data[j].max_congestion;
            }
            prd_alert_count += prd_daily_data[j].alert_count
        }
        if (prd_cnt != 0) {
            prd_avg_risk /= prd_cnt;
            prd_avg_congestion /= prd_cnt;
        }
        prd_avg_risk = Math.round(prd_avg_risk * 100) / 100;
        prd_avg_congestion = Math.round(prd_avg_congestion * 100) / 100;
        cam_result.selected_period.avg_risk = prd_avg_risk;
        cam_result.selected_period.avg_congestion = prd_avg_congestion;
        cam_result.selected_period.max_risk = prd_max_risk;
        cam_result.selected_period.max_congestion = prd_max_congestion;
        cam_result.selected_period.alert_count = prd_alert_count;

        /*
         * create list stats for selected period
         */

        let prd_lists = await getLists(cam_result.id, start_date, end_date);
        cam_result.selected_period.risks = prd_lists.risks
        cam_result.selected_period.congestions = prd_lists.congestions

        result.push(cam_result);
    }
    res.send(result);
}

module.exports = {
    getStatsByDate
};