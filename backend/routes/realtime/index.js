const express = require('express')
const router = express.Router();

const {
    processStream
} = require('./realtime')

function streamAnalyzedImage(io) {
    io.on('connection', (socket) => {
        socket.on('camstream', (stream) => {
            let processedStream = processStream(stream);
            io.broadcast.emit('stream_display', processedStream);
        });
    });
}

module.exports = (io) => {
    streamAnalyzedImage(io);
    return router;
}