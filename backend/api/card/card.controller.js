const cardService = require('./card.service');
const boardService = require('./../board/board.service');
const logger = require('../../services/logger.service');
const utilService = require('./../../services/util.service');

// BOARD CRUD //

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
    const { boardId, listIdx, id } = req.params;
    try {
        await cardService.deleteCard(id);
        await boardService.deleteCard(boardId, listIdx, id);
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addCard(req, res) {
    let { boardId, listId, listIdx, card } = req.body
    if (req.session.user) {
        card.createdBy = {
            userId: req.session.user._id,
            boardId,
            listId
        }
    }
    try {
        const realCard = await cardService.addCard(card);
        await boardService.addCard(boardId, listIdx, realCard);
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateCard(req, res) {
    const card = req.body;
    try {
        await cardService.updateCard(card);
        const realCard = await cardService.getCardById(card._id)
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
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function deleteComment(req, res) {
    const cardId = req.params.id;
    const commentId = req.body.commentId;
    try {
        const card = await cardService.deleteComment(cardId, commentId);
        res.send(card);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

// async function addCard(req, res) {
//     // const cardId = req.params.id;
//     const cardId = "5ff1b13c36eed552e70fec47";
//     let { listIdx, card } = req.body;
//     try {
//         await cardService.addCard(cardId, listIdx, card);
//         res.json(card);
//     } catch (err) {
//         console.log(`ERROR: ${err}`)
//         throw err;
//     }
// }

module.exports = {
    getCard,
    getCards,
    deleteCard,
    addCard,
    updateCard,
    addComment,
    deleteComment
}