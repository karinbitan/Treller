const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getCardById,
    deleteCard,
    updateCard,
    addCard,
    addComment,
    deleteComment
}

async function query(cardIds = []) {
    try {
        let where = {}
        if (cardIds.length) {
            where = { _id: { $in: cardIds } };
        }
        const collection = await dbService.getCollection('card')
        let cards = await collection.find(where).toArray();
        return cards;
    } catch (err) {
        console.log('ERROR: cannot find cards', err)
        throw err;
    }
}


async function getCardById(cardId) {
    const collection = await dbService.getCollection('card');
    try {
        let card = await collection.findOne({ _id: ObjectId(cardId) })
        return card;
    } catch (err) {
        console.log(`ERROR: cannot find card ${cardId}`)
        throw err;
    }
}


async function deleteCard(cardId) {
    const collection = await dbService.getCollection('card');
    try {
        await collection.deleteOne({ _id: ObjectId(cardId) });
    } catch (err) {
        console.log(`ERROR: cannot delete card ${cardId}`)
        throw err;
    }
}

async function updateCard(card) {
    const collection = await dbService.getCollection('card');
    const id = card._id;
    delete card._id


    try {
        await collection.replaceOne({ _id: ObjectId(id) }, card);
        card._id = ObjectId(id);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot update card ${card._id}`)
        throw err;
    }
}

async function addCard(card) {
    const collection = await dbService.getCollection('card');
    try {
        const res = await collection.insertOne(card);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot insert card`)
        throw err;
    }
}

async function addComment(cardId, comment) {
    const collection = await dbService.getCollection('card');
    try {
        const res = await collection.updateOne({ _id: ObjectId(cardId) }, { $push: { comments: comment } });
        const card = await getCardById(cardId);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot insert card`)
        throw err;
    }
}

async function deleteComment(cardId, commentId) {
    const collection = await dbService.getCollection('card');
    try {
        const res = await collection.updateOne({ _id: ObjectId(cardId) }, { $pull: { comments: { $elemMatch: { _id: commentId } } } });
        const card = await getCardById(cardId);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot insert card`)
        throw err;
    }
}