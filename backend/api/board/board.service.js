const dbService = require('../../services/db.service');
const cardService = require('./../card/card.service');
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
    addCard,
    deleteCard
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
        //     let aggQuery = [{
        //         $unwind: '$lists'
        //     },
        //     {
        //         $lookup: {
        //             from: 'card',
        //             localField: 'lists.cards',
        //             foreignField: '_id',
        //             as: 'lists.cards'
        //         }

        //     }
        // ]
        // let board = await collection.aggregate(aggQuery).toArray();
        // return board;

        let board = await collection.findOne({ _id: ObjectId(boardId) });

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

    board.lists.map(list => {
        if (list.cards && list.cards.length) {
            list.cards = list.cards.map((card) => {
                const cardId = card._id;
                return card._id = ObjectId(cardId);
            })
        }
        return list;
    })

    try {
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
        console.log(`ERROR: cannot update board ${boardId}`)
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
    const memberToAdd = { _id: member._id, fullName: member.fullName };
    try {
        const result = await collection.updateOne({ _id: ObjectId(boardId) },
            { $push: { members: memberToAdd } });
        return result
    } catch (err) {
        console.log(`ERROR: cannot insert list`)
        throw err;
    }
}

// LIST //
async function addList(boardId, list) {
    const collection = await dbService.getCollection('board');
    // if (list._id) {
    //     delete list._id;
    //     list.cards.forEach(card => {
    //         if (card && card.length) {
    //             delete card._id;
    //             cardService.addCard(card)
    //         }
    //     })
    //     .map(card =>{
    //         return 
    //     })
    // } else {
    //     list._id = _makeId();
    // }
    try {
        const result = await collection.updateOne({ _id: ObjectId(boardId) },
            { $push: { lists: list } });
        return result.lists;
    } catch (err) {
        console.log(`ERROR: cannot insert list`)
        throw err;
    }
}

async function deleteList(boardId, listId) {
    const collection = await dbService.getCollection('board');
    try {
        _deleteCards(boardId, listId);
        await collection.updateOne({ _id: ObjectId(boardId) },
            //  { $pull: { lists: { $elemMatch: { _id: listId } } } });
            { $pull: { lists: { _id: listId } } });
    } catch (err) {
        console.log(`ERROR: cannot delete board ${boardId}`)
        throw err;
    }
}

// CARD // 
async function addCard(boardId, listIdx, card) {
    const collection = await dbService.getCollection('board');
    const field = 'lists.' + listIdx + '.cards';
    try {
        await collection.updateOne({ _id: ObjectId(boardId) },
            { $push: { [field]: card._id } }
        );
        return card;
    } catch (err) {
        console.log(`ERROR: cannot insert card`)
        throw err;
    }
}

async function deleteCard(boardId, listIdx, cardId) {
    const collection = await dbService.getCollection('board');
    const field = 'lists.' + listIdx + '.cards';
    try {
        await collection.update({ _id: ObjectId(boardId) },
            // { $pull: { "lists": { "cards": { $elemMatch: { cardId } } } } }
            { $pull: { [field]: ObjectId(cardId) } }
        );
    } catch (err) {
        console.log(`ERROR: cannot delete board ${boardId}`)
        throw err;
    }
}

async function _deleteCards(boardId, listId) {
    let board = await getBoardById(boardId);
    board.lists.forEach(list => {
        if (list.cards || list.cards.length) {
            if (list._id === listId) {
                list.cards.forEach(async (card) => {
                    await cardService.deleteCard(card._id)
                })
            }
        }
    })
}