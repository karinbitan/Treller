module.exports = {
    listenToSocketEvents,
}

function listenToSocketEvents(io) {
    io.on('connection', socket => {
        // BOARD //
        socket.on('register board', boardId => {
            socket.join(boardId)
        })
        // CARD //
        socket.on('register card', cardId => {
            socket.join(cardId)
        });
        // USER //
        socket.on('register user', userId => {
            socket.join(userId)
        });
    })
}
