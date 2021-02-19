const cardService = require('./card.service');
const boardService = require('./../board/board.service');
const userService = require('./../user/user.service');
const utilService = require('./../../services/util.service');

const { socketConnection } = require('./../../server');

async function getCards(req, res) {
    try {
        const cards = await cardService.query(req.query);
        res.send(cards);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function getCard(req, res) {
    try {
        const card = await cardService.getCardById(req.params.id);
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function deleteCard(req, res) {
    const cardId = req.params.id;
    let card = await cardService.getCardById(cardId);
    card.members.forEach(async (member) => {
        await userService.deleteCardFromUser(member._id, cardId)
    });
    try {
        await cardService.deleteCard(cardId);
        socketConnection.to(cardId).emit('updatedCard', cardId);
        socketConnection.to(card.createdBy.boardId).emit('newNotification',
            {
                message: `Card title: ${card.title} was deleted by`,
                byUser: { _id: member._id, fullName: member.fullName }
            })
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addCard(req, res) {
    let { boardId, listId, listIdx, card } = req.body
    const user = req.session.user;
    if (req.session.user) {
        card.createdBy = {
            userId: req.session.user._id,
            boardId,
            listId
        }
    }
    try {
        const realCard = await cardService.addCard(card);
        await boardService.addCardToList(card.createdBy.boardId, listIdx, realCard);
        socketConnection.to(card.createdBy.boardId).emit('updatedBoard', card.createdBy.boardId);
        socketConnection.to(card._id).emit('updatedCard', card._id);
        socketConnection.to(card.createdBy.boardId).emit('newNotification',
            {
                message: `Card title: ${card.title} was added by`,
                byUser: { id: user._id, fullName: user.fullName }
            })
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateCard(req, res) {
    const card = req.body;
    const boardId = card.createdBy.boardId;
    try {
        await cardService.updateCard(card);
        const realCard = await cardService.getCardById(card._id)
        socketConnection.to(card._id).emit('updatedCard', card._id)
        socketConnection.to(boardId).emit('updatedBoard', boardId)
        res.send(realCard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateCardCollection(req, res) {
    const cardId = req.params.id;
    const boardId = card.createdBy.boardId;
    const updateObject = req.body;
    try {
        await cardService.updateCardCollection(cardId, updateObject);
        const realCard = await cardService.getCardById(cardId);
        socketConnection.to(cardId).emit('updatedCard', cardId);
        socketConnection.to(boardId).emit('updatedBoard', boardId)
        res.send(realCard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addCardMember(req, res) {
    const cardId = req.params.id;
    let member = req.body;
    member = {
        _id: member._id,
        fullName: member.fullName
    }
    try {
        await cardService.addCardMember(cardId, member);
        await userService.addCardToUser(member._id, cardId)
        const realCard = await cardService.getCardById(cardId);
        socketConnection.to(cardId).emit('updatedCard', cardId);
        socketConnection.to(realCard.createdBy.boardId).emit('updatedBoard', realCard.createdBy.boardId);
        socketConnection.to(realCard.createdBy.boardId).emit('newNotification',
            {
                message: `${member.fullName} was added to card: ${realCard.title} by`,
                byUser: { id: member._id, fullName: member.fullName }
            })
        res.send(realCard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addComment(req, res) {
    const cardId = req.params.id;
    let comment = req.body;
    comment._id = utilService._makeId();
    if (!req.session.user) {
        comment.byMember = {
            fullName: 'Guest'
        }
    } else {
        comment.byMember = {
            _id: req.session.user._id,
            fullName: req.session.user.fullName,
            createdAt: Date.now()
        }
    }
    try {
        const card = await cardService.addComment(cardId, comment);
        socketConnection.to(cardId).emit('updatedCard', cardId);
        socketConnection.to(card.createdBy.boardId).emit('newNotification',
            {
                message: `Comment added on card: ${card.title} by`,
                byUser: { _id: comment.byMember._id, fullName: comment.byMember.fullName }
            })
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function deleteComment(req, res) {
    const { id, commentId } = req.params;
    try {
        const card = await cardService.deleteComment(id, commentId);
        socketConnection.to(id).emit('updatedCard', id);
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addTodo(req, res) {
    const { id, checklistIdx } = req.params;
    let todo = req.body;
    todo._id = utilService._makeId();
    try {
        const card = await cardService.addTodo(id, checklistIdx, todo);
        socketConnection.to(id).emit('updatedCard', id);
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function deleteTodo(req, res) {
    const { id, checklistIdx, todoId } = req.params;
    try {
        const card = await cardService.deleteTodo(id, checklistIdx, todoId);
        socketConnection.to(id).emit('updatedCard', id);
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

module.exports = {
    getCard,
    getCards,
    deleteCard,
    addCard,
    updateCard,
    updateCardCollection,
    addCardMember,
    addComment,
    deleteComment,
    addTodo,
    deleteTodo
}