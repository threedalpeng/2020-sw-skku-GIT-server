const express = require('express')
const router = express.Router();

const {
    processStream,
    switchPythonProcess
} = require('./realtime');

router.get('/video', function (res, req, next) {
    switchPythonProcess();
});

function streamAnalyzedImage(io) {
    io.on('connection', (socket) => {
        socket.on('camstream', async (stream) => {
            let processedStream = await processStream(stream);
            socket.broadcast.emit('stream_display', processedStream);
        });
    });
}

module.exports = (io) => {
    streamAnalyzedImage(io);
    return router;
}