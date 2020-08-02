var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Corona Alarm System' });
});

module.exports = function(io){

  io.on('connection', function (socket) {
    socket.on('msg', function(msg){
      console.log('hi');
      console.log(msg);
      io.emit('msg display', msg);
    });
  });

  return router;
}