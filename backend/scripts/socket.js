let io = require('socket.io')();

let default_nsp = io.of();

module.exports = {
    io
};