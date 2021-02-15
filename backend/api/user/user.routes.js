const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { getUsers, getUserById, updateUser, updateUserCollection, deleteUser } = require('./user.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', requireAuth, updateUser);
router.patch('/:id', requireAuth, updateUserCollection);
router.delete('/:id', requireAuth, deleteUser);

module.exports = router;