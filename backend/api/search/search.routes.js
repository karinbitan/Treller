const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { getCardSearchResult, getUserSearchResult } = require('./search.controller.js');
const router = express.Router();

router.get('/card', requireAuth, getCardSearchResult);
router.get('/user', requireAuth, getUserSearchResult);


module.exports = router;