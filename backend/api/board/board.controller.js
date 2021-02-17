const boardService = require('./board.service');
const userService = require('./../user/user.service');
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

async function deleteBoard(req, res) {
    try {
        await boardService.deleteBoard(req.params.id);
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
                // imgUrl: req.session.user.imgUrl
            }
            board.members.push({
                _id: req.session.user._id,
                fullName: req.session.user.fullName
            })
        }
        await boardService.addBoard(board);
        await userService.addBoard(req.session.user._id, board._id);
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
            msg = { message: `${user.fullName} invited you to join board: ${board.title}.`,
             id: board._id, status: {isSeen: false, msg: ''} });
        await userService.addUserNotification(member._id, msg);
        res.send(msg);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function addMemberToBoard(req, res) {
    const boardId = req.params.id;
    let member = req.body;
    member = { _id: member._id, fullName: member.fullName }
    try {
        await boardService.addMemberToBoard(boardId, member);
        await userService.addMemberToBoard(boardId, member);
        const realBoard = await boardService.getBoardById(boardId);
        socketConnection.to(member._id).emit('newNotification',
            { message: `You were added to board: ${realBoard.title}.`, id: boardId })
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
        await boardService.deleteList(boardId, listId);
        socketConnection.to(boardId).emit('updatedBoard', boardId);
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

// CARD //
async function deleteCard(req, res) {
    const { id, listIdx, cardId } = req.params;
    try {
        await boardService.deleteCard(id, listIdx, cardId);
        socketConnection.to(id).emit('updatedBoard', id);
        // socketConnection.to(boardId).emit('newNotification', { message: `Card ${} deleted`, id: cardId });
        res.end();
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

module.exports = {
    getBoard,
    getBoards,
    deleteBoard,
    addBoard,
    updateBoard,
    updateBoardCollection,
    addMemberToBoard,
    addList,
    deleteList,
    deleteCard,
    inviteMemberToBoard
}