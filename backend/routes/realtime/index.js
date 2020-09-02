const express = require('express')
const router = express.Router();

const {
    processStream,
    switchPythonProcess,
    killPythonProcess
} = require('./realtime');

router.get('/switch', async function (req, res, next) {
    let process_type = await switchPythonProcess();
    res.end(process_type);
});

router.get('/kill', function (req, res, next) {
    killPythonProcess();
    res.end("Kill");
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