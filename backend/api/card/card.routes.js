const express = require('express');
const { requireAuth, requireBoardMember, requireCardMember } = require('../../middlewares/requireAuth.middleware');
const { getCards, getCard, deleteCard, updateCard, updateCardCollection, addCard, addCardMember,
     addComment, deleteComment, addTodo, deleteTodo } = require('./card.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getCards);
router.get('/:id', getCard);
router.delete('/:id/comments/:commentId', requireAuth, requireBoardMember, deleteComment);
router.put('/:boardId/:id', requireAuth, requireBoardMember, updateCard);
router.patch('/:id', requireAuth, requireBoardMember, updateCardCollection);
router.post('/', requireAuth, requireBoardMember, addCard);
router.post('/:id/members', requireBoardMember, requireAuth, addCardMember);
router.post('/:id/comments', requireAuth, requireBoardMember, addComment);
router.post('/:id/:checklistIdx/todos', requireAuth, requireBoardMember, addTodo);
router.delete('/:id/checklists/:checklistIdx/todos/:todoId', requireAuth, requireBoardMember, deleteTodo);
router.delete('/:id', requireAuth, requireBoardMember, deleteCard);


module.exports = router;