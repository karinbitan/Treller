const express = require('express');
const { requireAuth, requireBoardOwner, requireBoardMember } = require('../../middlewares/requireAuth.middleware');
const { getBoards, getBoard,getBoardForBoardPage, deleteBoard, updateBoard, updateBoardCollection, addBoard, addList,
     deleteList, updateListTitle, addMemberToBoard, deleteCardFromList, inviteMemberToBoard } = require('./board.controller.js');

const router = express.Router();

router.get('/', getBoards);
router.get('/:id', getBoard);
router.get('/:id/boardPage', getBoardForBoardPage);
router.put('/:id', requireAuth, requireBoardMember, updateBoard);
router.patch('/:id/list/:listIdx', requireAuth, requireBoardMember, updateListTitle);
router.patch('/:id', requireAuth, requireBoardMember, updateBoardCollection);
router.post('/', requireAuth, addBoard);
router.post('/:id/invite', requireAuth, requireBoardMember, inviteMemberToBoard);
router.post('/:id/add', requireAuth, addMemberToBoard);
router.post('/:id/list', requireAuth, requireBoardMember, addList);
router.delete('/:id', requireAuth, requireBoardOwner, deleteBoard);
router.delete('/:id/list/:listIdx/card/:cardId', requireAuth, requireBoardMember, deleteCardFromList)
router.delete('/:id/list/:listId', requireAuth, requireBoardMember, deleteList)

module.exports = router;