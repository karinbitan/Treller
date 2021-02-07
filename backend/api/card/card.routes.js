const express = require('express');
const { requireAuth, requireOwner } = require('../../middlewares/requireAuth.middleware');
const { getCards, getCard, deleteCard, updateCard, updateCardCollection,  addCard,
     addComment, deleteComment, addTodo, deleteTodo } = require('./card.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getCards);
router.get('/:id', getCard);
router.delete('/:boardId/:listIdx/:id', deleteCard);
router.put('/:id', updateCard);
router.patch('/:id', updateCardCollection);
router.post('/', addCard);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);
router.post('/:id/:checklistIdx/todos', addTodo);
router.delete('/:id/:checklistIdx/todos/:todoId', deleteTodo);


module.exports = router;