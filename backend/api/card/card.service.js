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


async function query(filterBy = {}) {
    const filter = _setFilter(filterBy);
    const collection = await dbService.getCollection('card');
    try {
        const cards = await collection.find(filter).toArray();
        return cards;
    } catch (err) {
        console.log('ERROR: cannot find cards', err);
        throw err;
    }
}

function _setFilter(filterBy) {
    const filter = {};
    if (filterBy.txt) {
        filter.title = filterBy.txt
    }
    // if (filterBy.minBalance) {
    //     filter.balance = { $gte: +filterBy.minBalance }
    // }
    if (filterBy.cardIds) {
        filter._id = { $in: filterBy.cardIds };
    }
    return filter;
}

// function _setFilter(filterBy) {
//     const filter = {};
//     let mainFilter = []
//     // if (filterBy.txt) {
//     //     filter.title = filterBy.txt
//     // }

//     if (filterBy.cardIds) {
//         filter._id = { $in: filterBy.cardIds };
//         mainFilter.push(filter._id)
//     }

//     // TODO: Support lowercase
//     // TODO: Support search by all
//     if (filterBy.txt) {
//         let textFields = []
//         textFields.push({ "title": { $regex: `.*${requestQuery.txt}.*` } });
//         textFields.push({ "description": { $regex: `.*${requestQuery.txt}.*` } });
//         // textFields.push({ "about": { $regex: `.*${requestQuery.txt}.*` } });

//         mainFilter.push({
//             $or: textFields
//         });
//     }

//     return mainFilter;
// }


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