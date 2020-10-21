const express = require('express');
const router = express.Router();
const {
    getCameraSettings,
    saveCameraSettings
} = require('./settings');

router.get('/camera/:id', getCameraSettings);
router.post('/camera', saveCameraSettings);

module.exports = router;
