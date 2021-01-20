const express = require('express')
const {requireAuth}  = require('../../middlewares/requireAuth.middleware')
const {login, signup, logout, getLoggedInUser} = require('./auth.controller')

const router = express.Router()

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/user', getLoggedInUser)

module.exports = router