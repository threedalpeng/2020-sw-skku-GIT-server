function recieveStream(io) {
    io.on('connection', (socket) => {
        socket.on('camstream', processStream(stream));
    })
}

function processStream(stream) {
    stream.total_people = stream.mask_weared + stream.mask_off + stream.mask_incorrect + stream.mask_unknown;
    stream.mask_off = stream.mask_off + stream.mask_incorrect;
    stream.img = stream.img.toString("base64");
    sendStream(stream);
}

function sendStream(stream) {
    io.broadcast.emit('stream_display', stream);
}

module.exports = {
    recieveStream
};