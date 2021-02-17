const express = require('express');
const { requireAuth, requireBoardOwner, requireBoardMember } = require('../../middlewares/requireAuth.middleware');
const { getBoard, getBoards, deleteBoard, updateBoard, updateBoardCollection, addBoard, addList, deleteList,
     addMemberToBoard, deleteCard, inviteMemberToBoard } = require('./board.controller.js');

const router = express.Router();

router.get('/', getBoards);
router.get('/:id', getBoard);
router.put('/:id', requireAuth, requireBoardMember, updateBoard);
router.patch('/:id', requireAuth, requireBoardMember, updateBoardCollection);
router.post('/', requireAuth, addBoard);
router.post('/:id/invite', requireAuth, requireBoardMember, inviteMemberToBoard);
router.post('/:id/add', requireAuth, requireBoardMember, addMemberToBoard);
router.post('/:id/list', requireAuth, requireBoardMember, addList);
router.delete('/:id', requireAuth, requireBoardOwner, deleteBoard);
router.delete('/:id/list/:listIdx/card/:cardId', requireAuth, requireBoardMember, deleteCard)
router.delete('/:id/list/:listId', requireAuth, requireBoardMember, deleteList)

module.exports = router;