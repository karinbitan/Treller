const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { getUsers, getUserById, updateUser,
     updateUserCollection, deleteUser, addBoardToFavorites, removeBoardToFavorites } = require('./user.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', requireAuth, updateUser);
router.patch('/:id', requireAuth, updateUserCollection);
router.delete('/:id', requireAuth, deleteUser);
router.post('/:id/favoriteBoards', requireAuth, addBoardToFavorites);
router.patch('/:id/favoriteBoards', requireAuth, removeBoardToFavorites);

module.exports = router;