const cardService = require('./../card/card.service');
// const boardService = require('./../board/board.service');
// BOARD CRUD //

async function getSearchResult(req, res) {
    try {
        const result = await cardService.query(req.query);
        res.send(result);
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}


module.exports = {
    getSearchResult
}