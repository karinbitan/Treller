const boardService = require('./board.service');
const userService = require('./../user/user.service');
const cardService = require('./../card/card.service');
const utilService = require('./../../services/util.service');
const { socketConnection } = require('./../../server');
const ObjectId = require('mongodb').ObjectId;

// BOARD CRUD //

async function getBoards(req, res, next) {
    try {
        const boards = await boardService.query(req.query);
        res.send(boards);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 500, message: err })
    }
}

async function getBoard(req, res, next) {
    try {
        const board = await boardService.getBoardById(req.params.id);
        req.session.board = board;
        res.send(board);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 500, message: err })
    }
}

async function getBoardForBoardPage(req, res, next) {
    try {
        let board = await boardService.getBoardById(req.params.id);
        if (!board) return
        board = {
            _id: board._id,
            title: board.title,
            members: board.members,
            style: board.style
        }
        res.send(board);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 403, message: err })
    }
}

async function deleteBoard(req, res, next) {
    const boardId = req.params.id;
    try {
        await _deleteBoardFromUser(boardId);
        await _deleteCardsFromBoard(boardId);
        await boardService.deleteBoard(boardId);
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 403, message: err })
    }
}

async function addBoard(req, res, next) {
    let board = req.body;
    try {
        if (board.isTemplate) {
            board.isTemplate = false;
            delete board._id;
            board.lists.forEach(list => {
                list._id = utilService._makeId();
            })
        }

        if (req.session.user) {
            board.createdBy = {
                _id: req.session.user._id,
                fullName: req.session.user.fullName
            }
            board.members.push(
                {
                    _id: req.session.user._id,
                    fullName: req.session.user._id
                }
            )
        }
        await boardService.addBoard(board);
        const lists = await Promise.all(board.lists.map(async (list) => {
            if (list.cards && list.cards.length) {
                list.cards = await Promise.all(list.cards.map(async (card) => {
                    delete card._id
                    card.createdBy = {
                        boardId: board._id,
                        listId: list._id,
                        userId: req.session.user._id
                    }
                    const newCard = await cardService.addCard(card);
                    // delete card;
                    return newCard;
                }))
            }
            return list;
        }))
        board.lists = lists;
        await boardService.updateBoard(board);
        await userService.addBoardToUser(req.session.user._id, board._id);
        const realBoard = await boardService.getBoardById(board._id)
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 403, message: err })
    }
}

async function updateBoard(req, res, next) {
    let board = req.body;
    let boardId = board._id;
    try {
        await boardService.updateBoard(board);
        const realBoard = await boardService.getBoardById(board._id);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 403, message: err })
    }
}

async function updateBoardCollection(req, res, next) {
    const boardId = req.params.id;
    const updatedObject = req.body;
    try {
        await boardService.updateBoardCollection(boardId, updatedObject);
        const realBoard = await boardService.getBoardById(boardId);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 403, message: err })
    }
}

async function inviteMemberToBoard(req, res, next) {
    let { board, member } = req.body;
    member = { _id: member._id, fullName: member.fullName }
    const user = req.session.user;
    try {
        socketConnection.to(member._id).emit('newUserNotification', member._id);
        const msg = {
            message: `${user.fullName} invited you to join board: ${board.title}.`,
            id: board._id, status: { isSeen: false, msg: '' }
        }
        await userService.addUserNotification(member._id, msg);
        res.send(msg);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 403, message: err })
    }
}

async function addMemberToBoard(req, res, next) {
    const boardId = req.params.id;
    const member = req.body;
    try {
        await boardService.addMemberToBoard(boardId, member);
        await userService.addMemberToBoard(boardId, member._id);
        const realBoard = await boardService.getBoardById(boardId);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        socketConnection.to(member._id).emit('newNotification',
            { message: `You were added to board: ${realBoard.title}`, id: boardId })
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 500, message: err })
    }
}

// LIST CRUDL //
async function addList(req, res, next) {
    const boardId = req.params.id;
    const user = req.session.user;
    let list = req.body;
    list._id = utilService._makeId();
    try {
        const realList = await boardService.addList(boardId, list);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        socketConnection.to(boardId).emit('newNotification',
            {
                message: `List title: ${list.title} was added by`,
                byUser: {
                    _id: user._id, fullName: user.fullName
                }
            })
        res.send(realList);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 500, message: err })
    }
}

async function deleteList(req, res, next) {
    const boardId = req.params.id;
    const { listId } = req.params;
    try {
        await _deleteCardsFromList(boardId, listId);
        await boardService.deleteList(boardId, listId);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        // Need list title //
        // socketConnection.to(boardId).emit('newNotification',
        // {
        //     message: `List: ${list.title} was deleted by`,
        //     byUser: { id: member._id, fullName: member.fullName }
        // })
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 500, message: err })
    }
}

async function updateListTitle(req, res, next) {
    const { id, listIdx } = req.params;
    const title = req.body.title;
    try {
        const realList = await boardService.updateListTitle(id, listIdx, title);
        socketConnection.to(id).emit('updatedBoard', id);
        res.send(realList);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 500, message: err })
    }
}

// CARD //
async function deleteCardFromList(req, res, next) {
    const { id, listIdx, cardId } = req.params;
    try {
        await boardService.deleteCardFromList(id, listIdx, cardId);
        socketConnection.to(id).emit('updatedBoard', id);
        res.send();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({ status: 500, message: err })
    }
}

async function _deleteBoardFromUser(boardId) {
    let board = await boardService.getBoardById(boardId);
    if (board) {
        if (board.members || boards.members.length) {
            board.members.forEach(async (member) => {
                await userService.deleteBoardFromUser(member._id, boardId);
                socketConnection.to(member._id).emit('updateUser', member._id);
                socketConnection.to(member._id).emit('newNotification',
                    {
                        message: `${board.title} was deleted by`,
                        byUser: { _id: member._id, fullName: member.fullName }
                    })
            });
        }
    }
}

async function _deleteCardsFromBoard(boardId) {
    let board = await boardService.getBoardById(boardId);
    if (board.lists) {
        board.lists.forEach(list => {
            if (list.cards || list.cards.length > 0) {
                list.cards.forEach(async (card) => {
                    await cardService.deleteCard(card._id)
                })
            }
        })
    }
}

async function _deleteCardsFromList(boardId, listId) {
    let board = await boardService.getBoardById(boardId);
    let list = board.lists.find(list => {
        return list._id === listId;
    });
    if (list.cards || list.cards.length > 0) {
        list.cards.forEach(async (card) => {
            await cardService.deleteCard(card._id);
        })
    }
}


module.exports = {
    getBoard,
    getBoards,
    getBoardForBoardPage,
    deleteBoard,
    addBoard,
    updateBoard,
    updateBoardCollection,
    addMemberToBoard,
    addList,
    deleteList,
    updateListTitle,
    deleteCardFromList,
    inviteMemberToBoard
}