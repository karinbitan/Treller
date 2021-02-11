module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        // BOARD //
        socket.on('savedBoard', (boardId) => {
            io.to(boardId).emit('newBoard', boardId)
        })
        socket.on('getNotification', (msg) => {
            io.to(boardId).emit('sendNotification', msg)
        })
        socket.on('register board', boardId => {
            socket.join(boardId)
        })
        // CARD //
        socket.on('savedCard', (cardId) => {
            io.to(cardId).emit('newCard', cardId)
        })
        socket.on('register card', cardId => {
            console.log(cardId, 'socket work!')
            socket.join(cardId)
        });

        // socket.on('register chat room', cardId => {
        //     socket.join(cardId)
        // }); 
        // socket.on('leave chat room', adoptionRequestId => {
        //     socket.leave(adoptionRequestId)
        // });
    })
}
