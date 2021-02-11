const express = require('express');
const { requireAuth, requireBoardOwner } = require('../../middlewares/requireAuth.middleware');
const { getBoard, getBoards, deleteBoard, updateBoard, updateBoardCollection, addBoard, addList, deleteList,
     addMemberToBoard } = require('./board.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

//BOARD
router.get('/', getBoards);
router.get('/:id', getBoard);
router.delete('/:id', requireAuth, requireBoardOwner, deleteBoard);
router.put('/:id', requireAuth, updateBoard);
router.patch('/:id/updatedObject', requireAuth, updateBoardCollection);
router.post('/', requireAuth, addBoard);
router.post('/:id', requireAuth, addMemberToBoard);
// LIST
router.post('/:id/list', requireAuth, addList);
router.delete('/:id/list/:listId', requireAuth, deleteList)
module.exports = router;