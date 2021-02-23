const cardService = require('./../card/card.service');
const userService = require('./../user/user.service');

async function getCardSearchResult(req, res) {
    try {
        if (req.query && req.query.txt.length > 0) {
            const result = await cardService.query(req.query);
            res.send(result);
        } else {
            res.end();
        }
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({status: 500, message: err})
    }
}

async function getUserSearchResult(req, res) {
    try {
        if (req.query && req.query.txt.length > 0) {
            const result = await userService.query(req.query);
            res.send(result);
        } else {
            res.end();
        }
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({status: 500, message: err})
    }
}

module.exports = {
    getCardSearchResult,
    getUserSearchResult
}