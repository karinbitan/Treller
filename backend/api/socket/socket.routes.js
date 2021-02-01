module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('savedBoard', () => {
            // io.emit('treats addTreat', treat)
            io.to(socket.myTopic).emit('newBoard')
        })
        socket.on('boardId topic', topic => {

            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })

        // socket.on('chat newMsg', (msg) => {

        //     io.to(socket.myTopic).emit('chat addMsg', msg)

        // })
        // socket.on('register chat room', adoptionRequestId => {
        //     socket.join(adoptionRequestId)
        // });

        // socket.on('leave chat room', adoptionRequestId => {
        //     socket.leave(adoptionRequestId)
        // });
    })
}
