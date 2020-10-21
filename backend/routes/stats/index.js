const express = require('express');
const router = express.Router();

const {
    getStatsByDate
} = require('./stats');

router.get('/:start_date/:end_date/:unit', getStatsByDate);

module.exports = router;