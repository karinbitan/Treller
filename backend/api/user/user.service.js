const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getUserById,
    getByUserName,
    deleteUser,
    updateUser,
    updateUserCollection,
    addUser,
    addBoardToUser,
    addMemberToBoard,
    addUserNotification,
    deleteBoardFromUser,
    addCardToUser,
    deleteCardFromUser
}

async function query(filterBy = {}) {
    const filter = _setFilter(filterBy)
    const collection = await dbService.getCollection('user')
    try {
        const users = await collection.find(filter).toArray();
        users.forEach(user => delete user.password);

        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        throw err;
    }
}

function _setFilter(filterBy) {
    const filter = [];
    // TODO: Support lowercase
    // TODO: Support search by all
    if (filterBy.txt) {
        let textFields = []
        textFields.push({ "fullName": { $regex: `.*${filterBy.txt}.*` } });
        textFields.push({ "userName": { $regex: `.*${filterBy.txt}.*` } });
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

async function getUserById(userId) {
    const collection = await dbService.getCollection('user');
    try {
        const user = await collection.findOne({ _id: ObjectId(userId) })
        if (user.length) {
            user = user[0]
        }
        if (user.password) delete user.password;
        return user;
    } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        throw err;
    }
}

async function getByUserName(userName) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ userName })
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userName}`)
        throw err;
    }
}

async function deleteUser(userId) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        console.log(`ERROR: cannot delete user ${userId}`)
        throw err;
    }
}

async function updateUser(user) {
    const collection = await dbService.getCollection('user')
    user._id = ObjectId(user._id);
    delete user._id;
    try {
        await collection.replaceOne({ _id: user._id }, { user });
        user._id = ObjectId(user._id);
        return user;
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err;
    }
}

async function updateUserCollection(userId, updatedObject) {
    const collection = await dbService.getCollection('user');
    try {
        await collection.updateOne({ _id: ObjectId(userId) }, { $set: updatedObject });
        return updatedObject;
    } catch (err) {
        console.log(`ERROR: cannot update user collection to user ${user._id}`)
        throw err;
    }
}

async function addUser(user) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.insertOne(user);
        return user;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

async function addUserNotification(userId, notification) {
    const collection = await dbService.getCollection('user');
    try {
        await collection.updateOne({ _id: ObjectId(userId) },
            {
                $push: {
                    notifications: { $each: [notification], $position: 0 }
                }
            });
        return notification;
    } catch (err) {
        console.log(`ERROR: cannot add notification to user ${userId}`)
        throw err;
    }
}


// BOARD //

async function addBoardToUser(userId, boardId) {
    const collection = await dbService.getCollection('user');
    try {
        await collection.updateOne({ _id: ObjectId(userId) },
            { $push: { boardsMember: boardId, boardsOwner: boardId } });
        return boardId
    } catch (err) {
        console.log(`ERROR: cannot add board ${boardId} to ${user._id}`)
        throw err;
    }
}

async function addMemberToBoard(boardId, member) {
    const collection = await dbService.getCollection('user');
    try {
        const res = await collection.updateOne({ _id: ObjectId(member._id) },
            { $push: { boardsMember: ObjectId(boardId) } });
        return res;
    } catch (err) {
        console.log(`ERROR: cannot add user ${user._id} to board ${boardId}`)
        throw err;
    }
}

async function deleteBoardFromUser(userId, boardId) {
    const collection = await dbService.getCollection('user');
    try {
        await collection.updateOne({ _id: ObjectId(userId) },
            { $pull: { boardsMember: boardId, boardsOwner: boardId } });
        return boardId
    } catch (err) {
        console.log(`ERROR: cannot deleted board ${boardId} form user ${userId}`)
        throw err;
    }
}

// CARD //
async function addCardToUser(userId, cardId) {
    const collection = await dbService.getCollection('user');
    try {
        await collection.updateOne({ _id: ObjectId(userId) },
            { $push: { cardsMember: cardId } });
        return userId;
    } catch (err) {
        console.log(`ERROR: cannot deleted card ${cardId} form user ${userId} `)
        throw err;
    }
}

async function deleteCardFromUser(userId, cardId) {
    const collection = await dbService.getCollection('user');
    try {
        await collection.updateOne({ _id: ObjectId(userId) },
            { $pull: { cardsMember: cardId } });
        return userId;
    } catch (err) {
        console.log(`ERROR: cannot deleted card ${cardId} form user ${userId} `)
        throw err;
    }
}