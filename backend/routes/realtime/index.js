const express = require('express')
const router = express.Router();
const {
    io
} = require('../../scripts/socket');
const {
    processStream,
    initCameras,
    killAllProcesses,
    checkVideoProcessesById,
    runProcess
} = require('./realtime');

router.get('/init', initCameras);
router.get('/kill', killAllProcesses);

io.on('connection', (socket) => {
    socket.on('camstream', async (stream) => {
        let processedStream = await processStream(stream);
        socket.to("cam " + stream.camera_id).emit('stream_display', processedStream);
    });

    socket.on('join_room', (id) => {
        socket.join("cam " + id);
    });

    socket.on('leave_room', (id) => {
        socket.leave("cam " + id);
    });

    socket.on('switch_room', (cur_id, next_id) => {
        socket.leave("cam " + cur_id);
        socket.join("cam " + next_id);
        console.log(next_id);
        runProcess(next_id);
        // checkVideoProcessesById(next_id);
    });

    socket.on('disconnect', () => {
        socket.removeAllListeners();
    });
});

module.exports = router;