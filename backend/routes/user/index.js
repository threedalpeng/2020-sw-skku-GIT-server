const express = require('express');
const router = express.Router();

const {
  getListOfCamera
} = require('./user');

router.get('/cameras', getListOfCamera);

module.exports = router;