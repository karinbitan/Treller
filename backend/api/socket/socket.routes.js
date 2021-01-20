module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('treats newTreat', (pet) => {

            // console.log('treat', treat)
            // io.emit('treats addTreat', treat)
            // console.log(pet, 'petid')
            io.to(socket.myTopic).emit('treats addTreat', pet)
        })
        socket.on('treats topic', topic => {

            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })

        // socket.on('chat newMsg', (msg) => {

        //     io.to(socket.myTopic).emit('chat addMsg', msg)

        // })
        socket.on('register chat room', adoptionRequestId => {
            socket.join(adoptionRequestId)
        });

        socket.on('leave chat room', adoptionRequestId => {
            socket.leave(adoptionRequestId)
        });


    })

}