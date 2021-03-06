const dbService = require('../../services/db.service');
const cardService = require('./../card/card.service');
const userService = require('./../user/user.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getBoardById,
    deleteBoard,
    updateBoard,
    updateBoardCollection,
    addBoard,
    addMemberToBoard,
    addList,
    deleteList,
    updateListTitle,
    addCardToList,
    deleteCardFromList
}

async function query() {
    try {
        const collection = await dbService.getCollection('board')
        let boards = await collection.find().toArray();
        return boards;
    } catch (err) {
        console.log('ERROR: cannot find boards', err)
        throw err;
    }
}


async function getBoardById(boardId) {
    const collection = await dbService.getCollection('board');
    try {

        // let board = await collection.aggregate(aggQuery).toArray();
        // return board;

        let board = await collection.findOne({ _id: ObjectId(boardId) });

        if (board.members || board.members.length > 0) {
            let members = await Promise.all(board.members.map(async (member) => {
                const user = await userService.getUserById(member._id);
                return member = {
                    _id: user._id,
                    fullName: user.fullName
                }
            }))
            board.members = members;
        }

        // Get all card ids from all board lists.
        const cardIds = board.lists.reduce((cardIds, list) => {
            if (list.cards) {
                cardIds = [...cardIds, ...list.cards];
            }
            return cardIds;
        }, []);

        let cards = []
        // Get card documents by card ids.
        if (cardIds.length) {
            cards = await cardService.query({ cardIds });
        }

        // Build an hasmap (dict) which holds card id as key and card document in value.
        let cardObjects = {}
        cards.forEach((card) => {
            cardObjects[card._id] = card;
        })

        // Iterate on cards in every list and replace card id to the card document.
        board.lists = board.lists.map((list) => {
            if (list.cards && list.cards.length) {
                list.cards = list.cards.map((cardId) => {
                    return cardObjects[cardId];
                })
            }

            return list;
        });

        return board;
    } catch (err) {
        console.log(`ERROR: cannot find board ${boardId}`)
        throw err;
    }
}

async function deleteBoard(boardId) {
    const collection = await dbService.getCollection('board');
    try {
        await collection.deleteOne({ _id: ObjectId(boardId) })
    } catch (err) {
        console.log(`ERROR: cannot delete board ${boardId}`)
        throw err;
    }
}

async function updateBoard(board) {
    const collection = await dbService.getCollection('board');
    const id = board._id;
    delete board._id;
    try {
        board.lists = _getListWithCardObjectId(board);
        await collection.replaceOne({ _id: ObjectId(id) }, board);
        board._id = ObjectId(id)
        return board;
    } catch (err) {
        console.log(`ERROR: cannot update board ${board._id}`)
        throw err;
    }
}

async function updateBoardCollection(boardId, updatedObject) {
    const collection = await dbService.getCollection('board');
    try {
        await collection.updateOne({ _id: ObjectId(boardId) }, { $set: updatedObject });
        return updatedObject;
    } catch (err) {
        console.log(`ERROR: cannot update board collection of board ${boardId}`)
        throw err;
    }
}

async function addBoard(board) {
    const collection = await dbService.getCollection('board');
    try {
        await collection.insertOne(board);
        return board;
    } catch (err) {
        console.log(`ERROR: cannot insert board`)
        throw err;
    }
}

async function addMemberToBoard(boardId, member) {
    const collection = await dbService.getCollection('board');
    try {
        const result = await collection.updateOne({ _id: ObjectId(boardId) },
            { $push: { members: member } });
        return result
    } catch (err) {
        console.log(`ERROR: cannot add member ${member._id} to board ${boardId}`)
        throw err;
    }
}

// LIST //
async function addList(boardId, list) {
    const collection = await dbService.getCollection('board');
    try {
        const result = await collection.updateOne({ _id: ObjectId(boardId) },
            { $push: { lists: list } });
        return result.lists;
    } catch (err) {
        console.log(`ERROR: cannot add list ${list._id}`)
        throw err;
    }
}

async function deleteList(boardId, listId) {
    const collection = await dbService.getCollection('board');
    try {
        await collection.updateOne({ _id: ObjectId(boardId) },
            { $pull: { lists: { _id: listId } } });
    } catch (err) {
        console.log(`ERROR: cannot delete list ${listId}`)
        throw err;
    }
}

async function updateListTitle(boardId, listIdx, title) {
    const collection = await dbService.getCollection('board');
    const field = 'lists.' + listIdx + '.title';
    try {
        const result = await collection.updateOne({ _id: ObjectId(boardId) },
            { $set: { [field]: title } }
        );
        return result.title;
    } catch (err) {
        console.log(`ERROR: cannot update list index ${listIdx} title`)
        throw err;
    }
}

// CARD // 
async function addCardToList(boardId, listIdx, card) {
    const collection = await dbService.getCollection('board');
    const field = 'lists.' + listIdx + '.cards';
    try {
        await collection.updateOne({ _id: ObjectId(boardId) },
            { $push: { [field]: card._id } }
        );
        return card;
    } catch (err) {
        console.log(`ERROR: cannot add card ${card._id} to list index ${listIdx}`)
        throw err;
    }
}

async function deleteCardFromList(boardId, listIdx, cardId) {
    const collection = await dbService.getCollection('board');
    const field = 'lists.' + listIdx + '.cards';
    try {
        await collection.updateOne({ _id: ObjectId(boardId) },
            { $pull: { [field]: ObjectId(cardId) } }
        );
    } catch (err) {
        console.log(`ERROR: cannot delete card ${cardId} from list ${listId} in board ${boardId}`)
        throw err;
    }
}

function _getListWithCardObjectId(board) {
    return board.lists.map(list => {
        if (list.cards && list.cards.length) {
            list.cards = list.cards.map((card) => {
                const cardId = card._id;
                return card._id = ObjectId(cardId);
            })
        }
        return list;
    })
}