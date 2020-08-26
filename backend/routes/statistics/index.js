const express = require('express');
const router = express.Router();
const mysql = require("mysql");

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbuser',
    password: '1029',
    database: 'statistics'
});

//today mem for graph
router.get('', function (req, res, next) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let today = year + '/' + month + '/' + date;

    connection.query("SELECT time, risk, congestion FROM hour_data WHERE date = ?;", [today], function (err, result, fields) {
        if (err) {
            console.log("쿼리문에 오류가 있습니다.");
        }
        else {
            res.render('UI_2', {
                results_today: result
            });
        }
    });
});

//past mem
router.get('', function (req, res, next) {
    let year = req.params.year;
    let month = req.params.month;
    let date = req.params.date;
    let today = year + '/' + month + '/' + date;

    connection.query("SELECT n_people, no_mask, risk, congestion, high_risk_time FROM date_data WHERE date = ?;", [today], function (err, result, fields) {
        if (err) {
            console.log("쿼리문에 오류가 있습니다.");
        }
        else {
            res.render('UI_2', {
                results_past: result[0]
            });
        }
    });
});

module.exports = router;
