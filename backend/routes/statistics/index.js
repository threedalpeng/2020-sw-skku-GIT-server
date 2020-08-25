const express = require('express');
const router = express.Router();

const {
    getStatsByDate
} = require('./statistics');

router.get('/', function (req, res, next) {
    let now = new Date()
    getStatsByDate(now);
})

router.get('/:date', function (req, res, next) {
    let dateString = req.params.date;
    let requestedDate = new Date(
        dateString.substr(0, 4), // Year
        dateString.substr(4, 2), // Month
        dateString.substr(6, 2) // Day
    );
    getStatsByDate(requestedDate);
})

module.exports = router;