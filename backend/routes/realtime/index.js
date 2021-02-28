const express = require('express')
const router = express.Router();
const {
  io
} = require('../../lib/socket/socket');
const {
  processStream,
  initCameras,
  killAllProcesses,
  runProcess
} = require('./realtime');

router.get('/init', initCameras);
router.get('/kill', killAllProcesses);

/**
 * Socket.IO 웹소켓
 * 클라이언트가 서버에 연결되었을 때:
 */
io.on('connection', (socket) => {

  // 영상 및 데이터를 보낼 때
  socket.on('camstream', async (stream) => {
    let processedStream = await processStream(stream);
    socket.to("cam " + stream.camera_id).emit('stream_display', processedStream);
  });

  // 클라이언트가 방 들어오기 요청
  socket.on('join_room', (id) => {
    socket.join("cam " + id);
  });

  // 클라이언트가 방 나가기 요청
  socket.on('leave_room', (id) => {
    socket.leave("cam " + id);
  });

  // 클라이언트가 방 교체 요청
  socket.on('switch_room', (cur_id, next_id) => {
    socket.leave("cam " + cur_id);
    socket.join("cam " + next_id);
    console.log(next_id);
    runProcess(next_id);
    // checkVideoProcessesById(next_id);
  });

  // 클라이언트가 연결 종료
  socket.on('disconnect', () => {
    console.log('socket disconnected');
    socket.removeAllListeners();
  });
});

module.exports = router;