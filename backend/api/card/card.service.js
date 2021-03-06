const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getCardById,
    deleteCard,
    updateCard,
    updateCardCollection,
    addCard,
    addCardMember,
    addComment,
    deleteComment,
    addTodo,
    deleteTodo
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
    const filter = [];
    if (filterBy.cardIds) {
        filter.push({ _id: { $in: filterBy.cardIds } })
    }

    // TODO: Support lowercase
    // TODO: Support search by all
    if (filterBy.txt) {
        let textFields = []
        textFields.push({ "title": { $regex: `${filterBy.txt}.*`, '$options': 'i' } });
        textFields.push({ "description": { $regex: `${filterBy.txt}.*`, '$options': 'i' } });
        // textFields.push({ "about": { $regex: `.*${requestQuery.txt}.*` } });

        filter.push({
            $or: textFields
        });
    }

    if (!filter.length) {
        return {}
    }

    return mainFilter = {
        $and: filter
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

async function updateCardCollection(cardId, updatedObject) {
    const collection = await dbService.getCollection('card');
    const id = cardId;
    delete cardId
    try {
        await collection.updateOne({ _id: ObjectId(id) }, { $set: updatedObject });
        cardId = ObjectId(id);
        return updatedObject;
    } catch (err) {
        console.log(`ERROR: cannot update card ${cardId}`)
        throw err;
    }
}

async function addCard(card) {
    const collection = await dbService.getCollection('card');
    if (card._id) delete card._id;
    try {
        await collection.insertOne(card);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot insert card`)
        throw err;
    }
}

async function addCardMember(cardId, member) {
    const collection = await dbService.getCollection('card');
    try {
        const res = await collection.updateOne({ _id: ObjectId(cardId) },
            { $push: { members: member } });
        return res;
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
        const res = await collection.updateOne({ _id: ObjectId(cardId) },
            { $pull: { comments: { _id: commentId } } });
        const card = await getCardById(cardId);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot delete comment`)
        throw err;
    }
}

async function addTodo(cardId, checklistIdx, todo) {
    const collection = await dbService.getCollection('card');
    const field = 'checklists.' + checklistIdx + '.todos';
    try {
        const res = await collection.updateOne({ _id: ObjectId(cardId) },
            { $push: { [field]: todo } });
        const card = await getCardById(cardId);
        console.log(res);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot insert todo`)
        throw err;
    }
}

async function deleteTodo(cardId, checklistIdx, todoId) {
    const collection = await dbService.getCollection('card');
    const field = 'checklists.' + checklistIdx + '.todos';
    try {
        const res = await collection.updateOne({ _id: ObjectId(cardId) },
            { $pull: { [field]: { _id: todoId } } });
        const card = await getCardById(cardId);
        return card;
    } catch (err) {
        console.log(`ERROR: cannot delete todo`)
        throw err;
    }
}