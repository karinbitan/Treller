const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { getUsers, getUserById, updateUser,
     updateUserCollection, deleteUser, addUserNotification } = require('./user.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', requireAuth, updateUser);
router.patch('/:id', requireAuth, updateUserCollection);
router.delete('/:id', requireAuth, deleteUser);
router.post('/:id/notification', requireAuth, addUserNotification)

module.exports = router;