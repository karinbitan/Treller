module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('savedBoard', (boardId) => {
            // io.emit('treats addTreat', treat)
            console.log('Socket work');
            io.to(boardId).emit('newBoard', boardId)
        })
        socket.on('boardId topic', boardId => {

            // if (socket.myTopic) {
            //     // console.log(myTopic)
            //     socket.leave(socket.myTopic)
            // }
            socket.join(boardId)
            //console.log(topic)
        //socket.myTopic = topic;
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
