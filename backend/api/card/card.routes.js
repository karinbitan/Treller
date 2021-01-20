const express = require('express');
const { requireAuth, requireOwner } = require('../../middlewares/requireAuth.middleware');
const { getCards, getCard, deleteCard, updateCard, addCard, addComment, deleteComment } = require('./card.controller.js');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

//BOARD
router.get('/', getCards);
router.get('/:id', getCard);
router.delete('/:boardId/:listIdx/:id', deleteCard);
router.put('/:id', updateCard);
router.post('/', addCard);
router.post('/:id/comments', addComment);
router.get('/:id/comments/delete', deleteComment);


module.exports = router;