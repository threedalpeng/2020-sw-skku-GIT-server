const models = require("../../models");
const moment = require('moment');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값은 제외, 최솟값은 포함
}

 function putRandomData(cam_id, cmin, cmax, rmin, rmax, start_time, minutes) {
    return new Promise(async (resolve, reject) => {
        let cur_time = moment(start_time);
        for (let i = 0; i < minutes; i++) {
            let rcongestion = getRandomInt(cmin, cmax);
            let rrisk = getRandomInt(rmin, rmax);
            await models.minutely_data.create({
                camera_id: cam_id,
                analyzed_time: cur_time.format("YYYY-MM-DD HH:mm:00"),
                risk: rrisk,
                congestion: rcongestion
            }, {
                logging: false
            });
            console.log([cam_id, cur_time.format("YYYY-MM-DD HH:mm:00"), rcongestion, rrisk]);
            cur_time.add(1, 'minutes');
        }
        resolve();
    });
}

/*
function testFunc() {
    let cr_data = {
        cam_id: 1,
        start_time: "09:00:00",
        blocks: 28,
        minutes: 30,
        data: [[ // Thu
            {cmin: 0,  cmax: 5,  rmin: 0,  rmax: 5},  {cmin: 5,  cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 20, cmax: 30, rmin: 20, rmax: 30},
            {cmin: 20, cmax: 30, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 75, cmax: 85, rmin: 90, rmax: 95}, {cmin: 85, cmax: 95, rmin: 85, rmax: 95},
            {cmin: 65, cmax: 80, rmin: 65, rmax: 80}, {cmin: 60, cmax: 75, rmin: 60, rmax: 75},
            {cmin: 60, cmax: 80, rmin: 30, rmax: 40}, {cmin: 60, cmax: 80, rmin: 25, rmax: 35},
            {cmin: 40, cmax: 60, rmin: 35, rmax: 40}, {cmin: 40, cmax: 50, rmin: 30, rmax: 40},
            {cmin: 30, cmax: 40, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 25, cmax: 40, rmin: 25, rmax: 40},
            {cmin: 35, cmax: 45, rmin: 55, rmax: 65}, {cmin: 45, cmax: 50, rmin: 60, rmax: 70},
            {cmin: 40, cmax: 50, rmin: 45, rmax: 55}, {cmin: 35, cmax: 45, rmin: 35, rmax: 45},
            {cmin: 35, cmax: 40, rmin: 35, rmax: 40}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 5,  rmax: 10},
        ], [ // Fri
            {cmin: 0,  cmax: 5,  rmin: 0,  rmax: 5},  {cmin: 5,  cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 20, cmax: 30, rmin: 20, rmax: 30},
            {cmin: 20, cmax: 30, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 75, cmax: 85, rmin: 90, rmax: 95}, {cmin: 85, cmax: 95, rmin: 85, rmax: 95},
            {cmin: 65, cmax: 80, rmin: 65, rmax: 80}, {cmin: 60, cmax: 75, rmin: 60, rmax: 75},
            {cmin: 60, cmax: 80, rmin: 30, rmax: 40}, {cmin: 60, cmax: 80, rmin: 25, rmax: 35},
            {cmin: 40, cmax: 60, rmin: 35, rmax: 40}, {cmin: 40, cmax: 50, rmin: 30, rmax: 40},
            {cmin: 30, cmax: 40, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 25, cmax: 40, rmin: 25, rmax: 40},
            {cmin: 35, cmax: 45, rmin: 55, rmax: 65}, {cmin: 45, cmax: 50, rmin: 60, rmax: 70},
            {cmin: 40, cmax: 50, rmin: 45, rmax: 55}, {cmin: 35, cmax: 45, rmin: 35, rmax: 45},
            {cmin: 35, cmax: 40, rmin: 35, rmax: 40}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 5,  rmax: 10},
        ], [ // Sat
            {cmin: 0,  cmax: 5,  rmin: 0,  rmax: 5},  {cmin: 5,  cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 20, cmax: 30, rmin: 20, rmax: 30},
            {cmin: 20, cmax: 30, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 75, cmax: 85, rmin: 90, rmax: 95}, {cmin: 85, cmax: 95, rmin: 85, rmax: 95},
            {cmin: 65, cmax: 80, rmin: 65, rmax: 80}, {cmin: 60, cmax: 75, rmin: 60, rmax: 75},
            {cmin: 60, cmax: 80, rmin: 30, rmax: 40}, {cmin: 60, cmax: 80, rmin: 25, rmax: 35},
            {cmin: 40, cmax: 60, rmin: 35, rmax: 40}, {cmin: 40, cmax: 50, rmin: 30, rmax: 40},
            {cmin: 30, cmax: 40, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 25, cmax: 40, rmin: 25, rmax: 40},
            {cmin: 35, cmax: 45, rmin: 55, rmax: 65}, {cmin: 45, cmax: 50, rmin: 60, rmax: 70},
            {cmin: 40, cmax: 50, rmin: 45, rmax: 55}, {cmin: 35, cmax: 45, rmin: 35, rmax: 45},
            {cmin: 35, cmax: 40, rmin: 35, rmax: 40}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 5,  rmax: 10},
        ], [ // Sun
            {cmin: 0,  cmax: 5,  rmin: 0,  rmax: 5},  {cmin: 5,  cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 20, cmax: 30, rmin: 20, rmax: 30},
            {cmin: 20, cmax: 30, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 75, cmax: 85, rmin: 90, rmax: 95}, {cmin: 85, cmax: 95, rmin: 85, rmax: 95},
            {cmin: 65, cmax: 80, rmin: 65, rmax: 80}, {cmin: 60, cmax: 75, rmin: 60, rmax: 75},
            {cmin: 60, cmax: 80, rmin: 30, rmax: 40}, {cmin: 60, cmax: 80, rmin: 25, rmax: 35},
            {cmin: 40, cmax: 60, rmin: 35, rmax: 40}, {cmin: 40, cmax: 50, rmin: 30, rmax: 40},
            {cmin: 30, cmax: 40, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 25, cmax: 40, rmin: 25, rmax: 40},
            {cmin: 35, cmax: 45, rmin: 55, rmax: 65}, {cmin: 45, cmax: 50, rmin: 60, rmax: 70},
            {cmin: 40, cmax: 50, rmin: 45, rmax: 55}, {cmin: 35, cmax: 45, rmin: 35, rmax: 45},
            {cmin: 35, cmax: 40, rmin: 35, rmax: 40}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 5,  rmax: 10},
        ], [ // Mon
            {cmin: 0,  cmax: 5,  rmin: 0,  rmax: 5},  {cmin: 5,  cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 20, cmax: 30, rmin: 20, rmax: 30},
            {cmin: 20, cmax: 30, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 75, cmax: 85, rmin: 90, rmax: 95}, {cmin: 85, cmax: 95, rmin: 85, rmax: 95},
            {cmin: 65, cmax: 80, rmin: 65, rmax: 80}, {cmin: 60, cmax: 75, rmin: 60, rmax: 75},
            {cmin: 60, cmax: 80, rmin: 30, rmax: 40}, {cmin: 60, cmax: 80, rmin: 25, rmax: 35},
            {cmin: 40, cmax: 60, rmin: 35, rmax: 40}, {cmin: 40, cmax: 50, rmin: 30, rmax: 40},
            {cmin: 30, cmax: 40, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 25, cmax: 40, rmin: 25, rmax: 40},
            {cmin: 35, cmax: 45, rmin: 55, rmax: 65}, {cmin: 45, cmax: 50, rmin: 60, rmax: 70},
            {cmin: 40, cmax: 50, rmin: 45, rmax: 55}, {cmin: 35, cmax: 45, rmin: 35, rmax: 45},
            {cmin: 35, cmax: 40, rmin: 35, rmax: 40}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 5,  rmax: 10},
        ], [ // Tue
            {cmin: 0,  cmax: 5,  rmin: 0,  rmax: 5},  {cmin: 5,  cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 20, cmax: 30, rmin: 20, rmax: 30},
            {cmin: 20, cmax: 30, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 75, cmax: 85, rmin: 90, rmax: 95}, {cmin: 85, cmax: 95, rmin: 85, rmax: 95},
            {cmin: 65, cmax: 80, rmin: 65, rmax: 80}, {cmin: 60, cmax: 75, rmin: 60, rmax: 75},
            {cmin: 60, cmax: 80, rmin: 30, rmax: 40}, {cmin: 60, cmax: 80, rmin: 25, rmax: 35},
            {cmin: 40, cmax: 60, rmin: 35, rmax: 40}, {cmin: 40, cmax: 50, rmin: 30, rmax: 40},
            {cmin: 30, cmax: 40, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 25, cmax: 40, rmin: 25, rmax: 40},
            {cmin: 35, cmax: 45, rmin: 55, rmax: 65}, {cmin: 45, cmax: 50, rmin: 60, rmax: 70},
            {cmin: 40, cmax: 50, rmin: 45, rmax: 55}, {cmin: 35, cmax: 45, rmin: 35, rmax: 45},
            {cmin: 35, cmax: 40, rmin: 35, rmax: 40}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 5,  rmax: 10},
        ], [ // Wed
            {cmin: 0,  cmax: 5,  rmin: 0,  rmax: 5},  {cmin: 5,  cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 10, rmax: 15},
            {cmin: 10, cmax: 15, rmin: 10, rmax: 15}, {cmin: 20, cmax: 30, rmin: 20, rmax: 30},
            {cmin: 20, cmax: 30, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 75, cmax: 85, rmin: 90, rmax: 95}, {cmin: 85, cmax: 95, rmin: 85, rmax: 95},
            {cmin: 65, cmax: 80, rmin: 65, rmax: 80}, {cmin: 60, cmax: 75, rmin: 60, rmax: 75},
            {cmin: 60, cmax: 80, rmin: 30, rmax: 40}, {cmin: 60, cmax: 80, rmin: 25, rmax: 35},
            {cmin: 40, cmax: 60, rmin: 35, rmax: 40}, {cmin: 40, cmax: 50, rmin: 30, rmax: 40},
            {cmin: 30, cmax: 40, rmin: 20, rmax: 30}, {cmin: 30, cmax: 40, rmin: 30, rmax: 40},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 25, cmax: 40, rmin: 25, rmax: 40},
            {cmin: 35, cmax: 45, rmin: 55, rmax: 65}, {cmin: 45, cmax: 50, rmin: 60, rmax: 70},
            {cmin: 40, cmax: 50, rmin: 45, rmax: 55}, {cmin: 35, cmax: 45, rmin: 35, rmax: 45},
            {cmin: 35, cmax: 40, rmin: 35, rmax: 40}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
            {cmin: 15, cmax: 25, rmin: 10, rmax: 15}, {cmin: 10, cmax: 15, rmin: 5,  rmax: 10},
        ]]
    }

    let cur_date = moment('2020-10-01');
    let w_pct = [1, 0.95, 0.9025, 0.81225];
    for (let w = 0; w < 4; w++) {
        for (let i = 0; i < 7; i++) {
            let cur_time = moment(cur_date.format('YYYY-MM-DD') + ' ' + cr_data.start_time);
            for (let j = 0; j < cr_data.blocks; j++) {
                putRandomData(
                    cr_data.cam_id,
                    Math.round(cr_data.data[i][j].cmin * w_pct[w]), 
                    Math.round(cr_data.data[i][j].cmax * w_pct[w]),
                    Math.round(cr_data.data[i][j].rmin * w_pct[w]),
                    Math.round(cr_data.data[i][j].rmax * w_pct[w]),
                    cur_time, 
                    cr_data.minutes
                );
                cur_time.add(cr_data.minutes, 'minutes');
            }
            cur_date.add(1, 'days');
        }
    }
}
*/

async function testFunc() {
    let cr_data = {
        cam_id: 2,
        start_time: "10:00:00",
        blocks: 24,
        minutes: 30,
        data: [[ // Thu
            {cmin: 45, cmax: 50, rmin: 35, rmax: 40}, {cmin: 45, cmax: 50, rmin: 35, rmax: 40},
            {cmin: 40, cmax: 65, rmin: 30, rmax: 35}, {cmin: 40, cmax: 45, rmin: 30, rmax: 35},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 60, cmax: 65, rmin: 50, rmax: 55}, {cmin: 65, cmax: 70, rmin: 55, rmax: 60},
            {cmin: 65, cmax: 70, rmin: 55, rmax: 60}, {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 60, cmax: 65, rmin: 50, rmax: 55}, {cmin: 65, cmax: 70, rmin: 55, rmax: 60},
            {cmin: 65, cmax: 70, rmin: 55, rmax: 60}, {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 30, cmax: 35, rmin: 20, rmax: 25}, {cmin: 35, cmax: 40, rmin: 25, rmax: 30},
            {cmin: 25, cmax: 30, rmin: 15, rmax: 20}, {cmin: 25, cmax: 30, rmin: 15, rmax: 20},
        ], [ // Fri
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 50, cmax: 55, rmin: 40, rmax: 45},
            {cmin: 55, cmax: 60, rmin: 45, rmax: 50}, {cmin: 60, cmax: 65, rmin: 50, rmax: 55},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
        ], [ // Sat
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 30, cmax: 35, rmin: 20, rmax: 25}, {cmin: 30, cmax: 35, rmin: 20, rmax: 25},
            {cmin: 25, cmax: 30, rmin: 15, rmax: 20}, {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
        ], [ // Sun
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
        ], [ // Mon
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 55, cmax: 60, rmin: 45, rmax: 50},
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 60, cmax: 65, rmin: 50, rmax: 55},
            {cmin: 60, cmax: 65, rmin: 50, rmax: 55}, {cmin: 60, cmax: 65, rmin: 50, rmax: 55},
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 40, cmax: 45, rmin: 30, rmax: 35},
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 50, cmax: 55, rmin: 40, rmax: 45},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 65, cmax: 70, rmin: 55, rmax: 60}, {cmin: 70, cmax: 75, rmin: 60, rmax: 65},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
        ], [ // Tue
            {cmin: 45, cmax: 50, rmin: 35, rmax: 40}, {cmin: 50, cmax: 55, rmin: 40, rmax: 45},
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 50, cmax: 55, rmin: 40, rmax: 45},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 60, cmax: 65, rmin: 50, rmax: 55}, {cmin: 65, cmax: 70, rmin: 55, rmax: 60},
            {cmin: 45, cmax: 50, rmin: 35, rmax: 40}, {cmin: 45, cmax: 50, rmin: 35, rmax: 40},
        ], [ // Wed
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 55, cmax: 60, rmin: 45, rmax: 50},
            {cmin: 50, cmax: 55, rmin: 40, rmax: 45}, {cmin: 60, cmax: 65, rmin: 50, rmax: 55},
            {cmin: 60, cmax: 65, rmin: 50, rmax: 55}, {cmin: 60, cmax: 65, rmin: 50, rmax: 55},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
            {cmin: 65, cmax: 70, rmin: 55, rmax: 60}, {cmin: 70, cmax: 75, rmin: 60, rmax: 65},
            {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},  {cmin: 0,  cmax: 0,  rmin: 0,  rmax: 0},
        ]]
    }

    let cur_date = moment('2020-10-01');
    let w_pct = [1, 0.95, 0.9025, 0.81225];
    for (let w = 0; w < 4; w++) {
        for (let i = 0; i < 7; i++) {
            let cur_time = moment(cur_date.format('YYYY-MM-DD') + ' ' + cr_data.start_time);
            for (let j = 0; j < cr_data.blocks; j++) {
                if (cr_data.data[i][j].cmin !== 0 &&
                    cr_data.data[i][j].cmax !== 0 && 
                    cr_data.data[i][j].rmin !== 0 && 
                    cr_data.data[i][j].rmax !== 0) {
                    await putRandomData(
                        cr_data.cam_id,
                        Math.round(cr_data.data[i][j].cmin * w_pct[w]), 
                        Math.round(cr_data.data[i][j].cmax * w_pct[w]),
                        Math.round(cr_data.data[i][j].rmin * w_pct[w]),
                        Math.round(cr_data.data[i][j].rmax * w_pct[w]),
                        cur_time, 
                        cr_data.minutes
                    );
                }
                cur_time.add(cr_data.minutes, 'minutes');
            }
            cur_date.add(1, 'days');
        }
    }
}

testFunc();