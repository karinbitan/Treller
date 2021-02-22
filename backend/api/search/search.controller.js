const cardService = require('./../card/card.service');
// const boardService = require('./../board/board.service');
// BOARD CRUD //

async function getSearchResult(req, res) {
    try {
        if (req.query && req.query.txt.length > 0) {
            const result = await cardService.query(req.query);
            res.send(result);
        } else {
            res.end();
        }
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}


module.exports = {
    getSearchResult
}