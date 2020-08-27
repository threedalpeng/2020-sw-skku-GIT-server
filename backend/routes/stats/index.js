const express = require('express');
const router = express.Router();

const {
    getStatsByDate
} = require('./stats');

//today mem for graph
router.get('/', function (req, res, next) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let today = year + '/' + month + '/' + date;
    getStatsByDate(res, today);
});

//past mem
router.get('/:year/:month/:date', function (req, res, next) {
    let year = req.params.year;
    let month = req.params.month;
    let date = req.params.date;
    let today = year + '/' + month + '/' + date;
    getStatsByDate(res, today);
});

module.exports = router;