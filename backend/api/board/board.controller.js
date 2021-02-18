const boardService = require('./board.service');
const userService = require('./../user/user.service');
const cardService = require('./../card/card.service');
const utilService = require('./../../services/util.service');
const { socketConnection } = require('./../../server');

// BOARD CRUD //

async function getBoards(req, res) {
    try {
        const boards = await boardService.query(req.query);
        res.send(boards);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function getBoard(req, res) {
    try {
        const board = await boardService.getBoardById(req.params.id);
        req.session.board = board;
        res.send(board);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function getBoardForBoardPage(req, res) {
    try {
        let board = await boardService.getBoardById(req.params.id);
        board = {
            _id: board._id,
            title: board.title,
            members: board.members,
            style: board.style
        }
        res.send(board);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function deleteBoard(req, res) {
    const boardId = req.params.id;
    try {
        _deleteBoardFromUser(boardId);
        _deleteCardsFromBoard(boardId);
        await boardService.deleteBoard(boardId);
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addBoard(req, res) {
    let board = req.body;
    try {
        if (board.isTemplate) {
            board.isTemplate = false;
            delete board._id;
        }

        if (req.session.user) {
            board.createdBy = {
                _id: req.session.user._id,
                fullName: req.session.user.fullName
            }
            board.members.push(
                req.session.user._id,
            )
        }
        await boardService.addBoard(board);
        await userService.addBoardToUser(req.session.user._id, board._id);
        res.send(board);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateBoard(req, res) {
    const board = req.body;
    try {
        await boardService.updateBoard(board);
        const realBoard = await boardService.getBoardById(board._id);
        socketConnection.to(board._id).emit('updatedBoard', board._id);
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateBoardCollection(req, res) {
    const boardId = req.params.id;
    const updatedObject = req.body;
    try {
        await boardService.updateBoardCollection(boardId, updatedObject);
        const realBoard = await boardService.getBoardById(boardId);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function inviteMemberToBoard(req, res) {
    let { board, member } = req.body;
    member = { _id: member._id, fullName: member.fullName }
    const user = req.session.user;
    let msg = null;
    try {
        socketConnection.to(member._id).emit('newUserNotification',
            msg = {
                message: `${user.fullName} invited you to join board: ${board.title}.`,
                id: board._id, status: { isSeen: false, msg: '' }
            });
        await userService.addUserNotification(member._id, msg);
        res.send(msg);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addMemberToBoard(req, res) {
    const boardId = req.params.id;
    let { memberId } = req.body;
    try {
        await boardService.addMemberToBoard(boardId, memberId);
        await userService.addMemberToBoard(boardId, memberId);
        const realBoard = await boardService.getBoardById(boardId);
        socketConnection.to(memberId).emit('newNotification',
            { message: `You were added to board: ${realBoard.title},`, id: boardId })
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

// LIST CRUDL //
async function addList(req, res) {
    const boardId = req.params.id;
    const user = req.session.user;
    let list = req.body;
    list._id = utilService._makeId();
    try {
        const realList = await boardService.addList(boardId, list);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        socketConnection.to(boardId).emit('newNotification',
            {
                message: `List ${list.title} was added by`, user: {
                    id: user._id,
                    fullName: user.fullName
                }
            })
        res.send(realList);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function deleteList(req, res) {
    const boardId = req.params.id;
    const { listId } = req.params;
    try {
        _deleteCardsFromList(boardId, listId);
        await boardService.deleteList(boardId, listId);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateListTitle(req, res) {
    const { id, listIdx } = req.params;
    const title = req.body.title;
    try {
        const realList = await boardService.updateListTitle(id, listIdx, title);
        socketConnection.to(id).emit('updatedBoard', id);
        res.send(realList);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

// CARD //
async function deleteCardFromList(req, res) {
    const { id, listIdx, cardId } = req.params;
    try {
        await boardService.deleteCardFromList(id, listIdx, cardId);
        socketConnection.to(id).emit('updatedBoard', id);
        // socketConnection.to(boardId).emit('newNotification', { message: `Card ${} deleted`, id: cardId });
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function _deleteBoardFromUser(boardId) {
    let board = await boardService.getBoardById(boardId);
    if (board.members || boards.members.length) {
        board.members.forEach(async (member) => {
            await userService.deleteBoardFromUser(member._id, boardId)
        });
    }
}

async function _deleteCardsFromBoard(boardId) {
    let board = await boardService.getBoardById(boardId);
    board.lists.forEach(list => {
        if (list.cards || list.cards.length) {
            list.cards.forEach(async (card) => {
                await cardService.deleteCard(card._id)
            })
        }
    })
}

async function _deleteCardsFromList(boardId, listId) {
    let board = await boardService.getBoardById(boardId);
    board.lists.forEach(list => {
        if (list.cards || list.cards.length) {
            if (list._id === listId) {
                list.cards.forEach(async (card) => {
                    await cardService.deleteCard(card._id)
                })
            }
        }
    })
}

// function _getListWithCardObjectId(board) {
//     board.lists.map(list => {
//         if (list.cards && list.cards.length) {
//             list.cards = list.cards.map((card) => {
//                 const cardId = card._id;
//                 return card._id = ObjectId(cardId);
//             })
//         }
//         return list;
//     })
// }


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