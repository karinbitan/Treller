const express = require('express');
const { requireAuth, requireBoardOwner } = require('../../middlewares/requireAuth.middleware');
const { getBoard, getBoards, deleteBoard, updateBoard, updateBoardCollection, addBoard, addList, deleteList,
     addMemberToBoard, deleteCard, addNotification } = require('./board.controller.js');

const router = express.Router();

router.get('/', getBoards);
router.get('/:id', getBoard);
router.put('/:id', requireAuth, updateBoard);
router.patch('/:id', requireAuth, updateBoardCollection);
router.post('/', requireAuth, addBoard);
router.post('/:id', requireAuth, addMemberToBoard);
router.post('/:id/list', requireAuth, addList);
router.post('/:id/notification', addNotification)
router.delete('/:id/list/:listIdx/card/:cardId', requireAuth, deleteCard)
router.delete('/:id/list/:listId', requireAuth, deleteList)
router.delete('/:id', requireAuth, requireBoardOwner, deleteBoard);

module.exports = router;