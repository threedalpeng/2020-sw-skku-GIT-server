const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbuser',
    password: '1029',
    database: 'statistics'
});

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

async function getStatsByDate(res, dateNow) {
    let hour_data = await getHourDataByDate(dateNow);
    let day_data = await getDayDataByDate(dateNow);

    let result = {
        hour_stats: [],
        date_stats: {}
    };
    result.hour_stats = await convertHourData(hour_data);
    result.date_stats = day_data[0];
    res.send(result);
}

module.exports = {
    getStatsByDate
};