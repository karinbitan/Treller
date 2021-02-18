const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { getCards, getCard, deleteCard, updateCard, updateCardCollection,  addCard, addCardMember,
     addComment, deleteComment, addTodo, deleteTodo } = require('./card.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getCards);
router.get('/:id', getCard);
router.delete('/:id/comments/:commentId',requireAuth, deleteComment);
router.put('/:boardId/:id', requireAuth,updateCard);
router.patch('/:id', requireAuth,updateCardCollection);
router.post('/',requireAuth, addCard);
router.post('/:id/members', requireAuth,addCardMember);
router.post('/:id/comments', requireAuth,addComment);
router.post('/:id/:checklistIdx/todos',requireAuth, addTodo);
router.delete('/:id/checklists/:checklistIdx/todos/:todoId',requireAuth, deleteTodo);
router.delete('/:id',requireAuth, deleteCard);


module.exports = router;