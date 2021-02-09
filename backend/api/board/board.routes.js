const express = require('express');
const { requireAuth, requireOwner } = require('../../middlewares/requireAuth.middleware');
const { getBoard, getBoards, deleteBoard, updateBoard, updateBoardCollection, addBoard, addList, deleteList,
     addMemberToBoard} = require('./board.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

//BOARD
router.get('/', getBoards);
router.get('/:id', getBoard);
router.delete('/:id', requireAuth, requireOwner, deleteBoard);
router.put('/:id', requireAuth, updateBoard);
router.post('/', addBoard);
router.patch('/:id/updatedObject', updateBoardCollection);
router.post('/:id', addMemberToBoard);
// LIST
router.post('/:id/list', addList);
router.delete('/:id/list/:listId', deleteList)
module.exports = router;