const recieveStream = (io) => {
    io.on('connection', (socket) => {
        socket.on('camstream', processStream(stream));
    })
}

const processStream = (stream) => {
    stream.total_people = stream.mask_weared + stream.mask_off + stream.mask_incorrect + stream.mask_unknown;
    stream.mask_off = stream.mask_off + stream.mask_incorrect;
    sendStream(stream);
}

const sendStream = (stream) => {
    console.log(stream);
    io.broadcast.emit('stream_display', stream);
}

module.exports = {
    recieveStream
};