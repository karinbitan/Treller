const boardService = require('./board.service');
// const cardService = require('./../card/card.service');
const userService = require('./../user/user.service');
const logger = require('../../services/logger.service');
const utilService = require('./../../services/util.service');

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
        const realBoard = await boardService.getBoardById(board._id)
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function favoriteBoard(req, res) {
    const boardId = req.params.id;
    const { isStarred } = req.body;
    try {
        await boardService.favoriteBoard(boardId, isStarred);
        const realBoard = await boardService.getBoardById(boardId)
        res.send(realBoard);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

// LIST CRUDL //
async function addList(req, res) {
    const boardId = req.params.id;
    let list = req.body;
    list._id = utilService._makeId(); 
    try {
       const realList =  await boardService.addList(boardId, list);
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
    favoriteBoard,
    addList,
    deleteList
}