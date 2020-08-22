const express = require('express')
const router = express.Router();

const {
    recieveStream
} = require('./realtime')

module.exports = (io) => {
    recieveStream(io);
    return router;
}