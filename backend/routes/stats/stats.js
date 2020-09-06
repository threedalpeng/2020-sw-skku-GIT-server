const mysql = require('mysql2');
const config = require('../../config/config.json')

let connection = mysql.createConnection(config.database);

function getDayDataByDate(dateNow) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT n_people, no_mask, risk, congestion, high_risk_time FROM date_data WHERE date = ?;", [dateNow], function (err, result, fields) {
            if (err) {
                throw err;
            }
            resolve(result);
        });
    })
}

function getHourDataByDate(dateNow) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT time, risk, congestion FROM hour_data WHERE date = ?;", [dateNow], function (err, result, fields) {
            if (err) {
                throw err;
            }
            resolve(result);
        });
    })
}

function convertHourData(hours) {
    return new Promise((resolve, reject) => {
        let results = new Array(12);
        let count = 0;

        for (let i = 0; i < 12; i++) {
            let avg = {
                risk: 0,
                congestion: 0
            };
            let first = 2 * i;
            let second = first + 1;
            let add_count = 0;

            while (count < hours.length && hours[count].time.slice(0, -3) < first) {
                ++count;
            }
            if (count < hours.length && hours[count].time.slice(0, -3) == first) {
                ++add_count;
                avg.risk += hours[count].risk;
                avg.congestion += hours[count].congestion;
            }

            while (count < hours.length && hours[count].time.slice(0, -3) < second) {
                ++count;
            }
            if (count < hours.length && hours[count].time.slice(0, -3) == second) {
                ++add_count;
                avg.risk += hours[count].risk;
                avg.congestion += hours[count].congestion;
            }

            switch (add_count) {
                case 0:
                case 1:
                    results[i] = avg;
                    break;
                case 2:
                    avg.risk /= 2;
                    avg.congestion /= 2;
                    results[i] = avg;
                    break;
            }
        }

        resolve(results);
    });
}

function convertDateData(date) {
    return new Promise((resolve, reject) => {
        let result = {};
        if (date.n_people == 0)
            result.rate_mask_off = -1;
        else
            result.rate_mask_off = date.no_mask / date.n_people;
        result.risk = date.risk;
        result.congestion = date.congestion;
        result.high_risk_time = date.high_risk_time;
        resolve(result);
    });
}

async function getStatsByDate(res, dateNow) {
    let hour_data = await getHourDataByDate(dateNow);
    let day_data = await getDayDataByDate(dateNow);

    let result = {
        hour_stats: [],
        date_stats: {}
    };
    result.hour_stats = await convertHourData(hour_data);
    result.date_stats = await convertDateData(day_data[0]);
    res.send(result);
}

module.exports = {
    getStatsByDate
};