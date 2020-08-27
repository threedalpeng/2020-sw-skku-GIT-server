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

async function getStatsByDate(res, dateNow) {
    let hour_data = await getHourDataByDate(dateNow);
    let day_data = await getDayDataByDate(dateNow);

    let result = {
        hour_stats: [],
        date_stats: {}
    };
    result.hour_stats = hour_data;
    result.date_stats = day_data[0];
    res.send(result);
}

module.exports = {
    getStatsByDate
};