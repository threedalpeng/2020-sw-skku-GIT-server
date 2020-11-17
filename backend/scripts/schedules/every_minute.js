const models = require("../../models");
const moment = require('moment');

function getRandomAllInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값은 제외, 최솟값은 포함
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    if (min < 0)
        min = 0;
    if (min > 96)
        min = 95;
    max = Math.floor(max);
    if (max < 0)
        max = 3;
    if (max > 96)
        max = 95;
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값은 제외, 최솟값은 포함
}

function putRandomData(cam_id, cmin, cmax, rmin, rmax, start_time, minutes) {
    return new Promise(async (resolve, reject) => {
        let sugar = getRandomAllInt(-10, 10);
        let cur_time = moment(start_time);
        for (let i = 0; i < minutes; i++) {
            let rcongestion = getRandomInt(cmin+sugar, cmax+sugar);
            let rrisk = getRandomInt(rmin+sugar, rmax+sugar);
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

// 휴게실
async function testFunc() {
    let cr_data = [{
        // Lecture Room 1
        cam_id: 1,
        start_time: "08:00:00",
        blocks: 28,
        minutes: 30,
        data: [[ // Thu		
            [0,0,0,0],[0,15,0,15],
            [38,46,30,50],[40,50,50,65],
            [38,46,30,50],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,15,0,15],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [20,30,10,20],[20,40,20,30],
            [20,40,20,30],[0,0,0,0],	
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Fri
            [0,0,0,0],[0,15,0,15],
            [20,30,10,20],[20,40,20,30],
            [20,30,20,30],[20,40,20,30],
            [20,40,20,30],[20,40,20,30],
            [0,15,0,15],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],		
        ], [ // Sat
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Sun
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Mon
            [0,0,0,0],[0,15,0,15],
            [38,46,30,50],[40,50,50,65],
            [30,50,30,50],[0,0,0,0],	
            [0,0,0,0],[0,0,0,0],            
            [0,0,0,0],[0,0,0,0],            
            [0,15,0,15],[60,70,50,70],
            [60,75,60,70],[60,70,50,70],
            [0,15,0,15],[0,0,0,0],	
            [0,30,0,20],[60,70,50,70],
            [60,75,60,70],[60,70,50,70],
            [10,30,10,20],[0,0,0,0],	
            [0,0,0,0],[0,0,0,0],            
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Tue
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,15,0,15],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [65,75,70,90],[65,75,70,85],
            [60,70,70,85],[60,70,50,70],
            [60,75,60,70],[60,70,50,70],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,20,0,20],
            [50,65,30,55],[50,65,37,56],
            [40,55,33,47],[40,55,24,42],
            [20,25,10,23],[10,25,10,21],
            [0,15,0,5],[0,5,0,3],
        ], [ // Wed
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,15,0,15],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [0,0,0,0],[0,15,0,15],
            [38,46,30,50],[40,50,50,65],
            [30,50,30,50],[0,0,0,0],	
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,20,0,20],
            [50,65,30,55],[50,65,37,56],
            [40,55,33,47],[40,55,40,60],
            [40,55,33,47],[40,55,24,42],
            [20,45,10,30],[0,15,0,10]
        ]]
    }, {
        // Lecture Room 2
        cam_id: 2,
        start_time: "08:00:00",
        blocks: 28,
        minutes: 30,
        data: [[ // Thu
            [0,0,0,0],[0,15,0,15],
            [20,30,10,20],[20,40,20,30],
            [20,30,20,30],[20,40,20,30],
            [20,40,20,30],[20,40,20,30],
            [0,15,0,15],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,15,0,15],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [20,30,10,20],[20,40,20,30],
            [20,40,20,30],[0,0,0,0],    
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Fri
            [0,0,0,0],[0,15,0,15],
            [40,50,50,65],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [20,30,10,20],[20,40,20,30],
            [20,40,20,30],[0,0,0,0],    
            [0,0,0,0],[0,15,0,15],
            [38,46,30,50],[40,50,50,65],
            [30,50,30,50],[0,0,0,0],    
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Sat
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Sun
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Mon
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,15,0,15],[60,70,50,70],
            [60,75,60,70],[60,70,50,70],
            [0,15,0,15],[0,0,0,0],  
            [0,30,0,20],[60,70,50,70],
            [65,75,70,90],[65,75,70,85],
            [60,70,70,85],[60,70,50,70],
            [20,45,10,30],[0,15,0,10],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Tue
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,15,0,15],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [0,15,0,15],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [50,65,30,55],[50,65,37,56],
            [60,70,70,85],[60,70,50,70],
            [50,65,30,55],[50,65,37,56],
            [30,60,40,50],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Wed
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,15,0,15],[38,46,30,50],
            [40,50,50,65],[30,50,30,50],
            [0,0,0,0],[0,15,0,15],
            [0,30,0,20],[60,70,50,70],
            [60,75,60,70],[60,70,50,70],
            [0,0,0,0],[0,15,0,15],
            [38,46,30,50],[40,50,50,65],
            [30,50,30,50],[0,0,0,0],    
            [50,65,30,55],[50,65,37,56],
            [40,55,33,47],[40,55,40,60],
            [40,55,33,47],[40,55,24,42],
            [20,45,10,30],[0,15,0,10]
        ]]
    }, {
        // Lounge
        cam_id: 3,
        start_time: "08:00:00",
        blocks: 28,
        minutes: 30,
        data: [[ // Thu
            [0,0,0,0],[0,0,0,0],
            [0,5,0,5],[5,15,10,15],
            [35,45,55,65],[45,50,50,60],
            [60,70,45,75],[60,80,45,65],
            [35,40,35,40],[25,30,15,20],
            [65,80,65,80],[60,75,60,75],
            [75,85,90,95],[85,95,85,95],
            [60,80,30,40],[60,80,25,35],
            [40,60,35,40],[40,50,30,40],
            [30,40,20,30],[30,40,30,40],
            [25,40,25,40],[15,25,10,15],
            [10,15,10,15],[10,15,10,15],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Fri
            [0,0,0,0],[0,0,0,0],
            [0,5,0,5],[5,15,10,15],
            [35,45,55,65],[45,50,50,60],
            [60,70,45,75],[60,80,45,65],
            [35,40,35,40],[25,30,15,20],
            [65,80,65,80],[60,75,60,75],
            [75,85,90,95],[85,95,85,95],
            [60,80,30,40],[60,80,25,35],
            [40,60,35,40],[40,50,30,40],
            [30,40,20,30],[30,40,30,40],
            [25,40,25,40],[15,25,10,15],
            [10,15,10,15],[10,15,10,15],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Sat
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,5,0,5],[5,15,10,15],
            [30,40,20,30],[30,40,30,40],
            [10,15,10,15],[10,15,10,15],
            [35,40,35,40],[25,30,15,20],
            [40,45,40,45],[40,60,35,40],
            [40,50,30,40],[20,35,10,25],
            [20,25,10,25],[15,25,10,15],
            [25,40,25,40],[10,15,10,15],
            [10,15,10,15],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Sun
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,5,0,5],[5,15,10,15],
            [30,40,20,30],[30,40,30,40],
            [10,15,10,15],[10,15,10,15],
            [35,40,35,40],[25,30,15,20],
            [40,45,40,45],[40,60,35,40],
            [40,50,30,40],[20,35,10,25],
            [20,25,10,25],[15,25,10,15],
            [25,40,25,40],[10,15,10,15],
            [10,15,10,15],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Mon
            [0,0,0,0],[0,0,0,0],
            [0,5,0,5],[5,15,10,15],
            [35,45,55,65],[45,50,50,60],
            [60,70,45,75],[60,80,45,65],
            [35,40,35,40],[25,30,15,20],
            [65,80,65,80],[60,75,60,75],
            [75,85,90,95],[85,95,85,95],
            [60,80,30,40],[60,80,25,35],
            [40,60,35,40],[40,50,30,40],
            [30,40,20,30],[30,40,30,40],
            [25,40,25,40],[15,25,10,15],
            [10,15,10,15],[10,15,10,15],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Tue
            [0,0,0,0],[0,0,0,0],
            [0,5,0,5],[5,15,10,15],
            [35,45,55,65],[45,50,50,60],
            [60,70,45,75],[60,80,45,65],
            [35,40,35,40],[25,30,15,20],
            [65,80,65,80],[60,75,60,75],
            [75,85,90,95],[85,95,85,95],
            [60,80,30,40],[60,80,25,35],
            [40,60,35,40],[40,50,30,40],
            [30,40,20,30],[30,40,30,40],
            [25,40,25,40],[15,25,10,15],
            [10,15,10,15],[10,15,10,15],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ], [ // Wed
            [0,0,0,0],[0,0,0,0],
            [0,5,0,5],[5,15,10,15],
            [35,45,55,65],[45,50,50,60],
            [60,70,45,75],[60,80,45,65],
            [35,40,35,40],[25,30,15,20],
            [65,80,65,80],[60,75,60,75],
            [75,85,90,95],[85,95,85,95],
            [60,80,30,40],[60,80,25,35],
            [40,60,35,40],[40,50,30,40],
            [30,40,20,30],[30,40,30,40],
            [25,40,25,40],[15,25,10,15],
            [10,15,10,15],[10,15,10,15],
            [0,0,0,0],[0,0,0,0],
            [0,0,0,0],[0,0,0,0],
        ]]
    }];

    let w_pct = [1, 0.95, 0.89, 0.75];
    for (let c = 0; c < 3; c++) {
        let cur_date = moment('2020-10-01');
        for (let w = 0; w < 4; w++) {
            for (let i = 0; i < 7; i++) {
                let cur_time = moment(cur_date.format('YYYY-MM-DD') + ' ' + cr_data[c].start_time);
                for (let j = 0; j < cr_data[c].blocks; j++) {
                    if (cr_data[c].data[i][j][0] !== 0 &&
                        cr_data[c].data[i][j][1] !== 0 && 
                        cr_data[c].data[i][j][2] !== 0 && 
                        cr_data[c].data[i][j][3] !== 0) {
                        await putRandomData(
                            cr_data[c].cam_id,
                            Math.round(cr_data[c].data[i][j][0] * w_pct[w]), 
                            Math.round(cr_data[c].data[i][j][1] * w_pct[w]),
                            Math.round(cr_data[c].data[i][j][2] * w_pct[w]),
                            Math.round(cr_data[c].data[i][j][3] * w_pct[w]),
                            cur_time,
                            cr_data[c].minutes
                        );
                    }
                    cur_time.add(cr_data[c].minutes, 'minutes');
                }
                cur_date.add(1, 'days');
            }
        }
    }
}

/*
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
    let w_pct = [1, 0.95, 0.9025, 0.75];
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
*/

function updateRandomData(cam_id, amin, amax, days) {
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

async function testFunc2() {
    let cur_date = moment('2020-10-01');
    let ad = [[0, 5], [0, 1], [0, 1], [0, 0], [0, 1], [0, 1],[0, 2]]
    let w_pct = [1, 0.9, 0.8, 0.75];
    for (let w = 0; w < 4; w++) {
        for (let i = 0; i < 7; i++) {
            await models.daily_data.update({
                alert_count: getRandomInt(ad[i][0] * w_pct[w], ad[i][1] * w_pct[w])
            }, {
                where: {
                    camera_id: 2,
                    analyzed_time: cur_date.format('YYYY-MM-DD')
                }
            });
            cur_date.add(1, 'days');
        }
    }
}

async function testFunc3() {
    
    /*
    await models.minutely_data.destroy({
        truncate: true
    });
    */
    await models.hourly_data.destroy({
        truncate: true
    });
    await models.daily_data.destroy({
        truncate: true
    });
}

testFunc3();
//testFunc();