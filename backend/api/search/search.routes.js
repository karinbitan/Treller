const express = require('express');
const { requireAuth, requireOwner } = require('../../middlewares/requireAuth.middleware');
const { getSearchResult } = require('./search.controller.js');
const router = express.Router();

router.get('/', getSearchResult);


module.exports = router;