const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getUserById,
    getByUserName,
    deleteUser,
    updateUser,
    addUser,
    addBoard
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('user')
    try {
        const users = await collection.find(criteria).toArray();
        users.forEach(user => delete user.password);

        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        throw err;
    }
}

async function getUserById(userId) {
    const collection = await dbService.getCollection('user');
    try {
        let aggQuery = [{
            $match: { "_id": ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'board',
                localField: 'boardsMember',
                foreignField: '_id',
                as: 'boardsMember'
            }
        }
        ]
        let user = await collection.aggregate(aggQuery).toArray();
        // const user = await collection.findOne({ _id: ObjectId(userId) })
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

async function addBoard(userId, boardId) {
    const collection = await dbService.getCollection('user');
    try {
        await collection.updateOne({ _id: ObjectId(userId) },
            { $push: { boardsMember: boardId, boardsOwner: boardId } });
        return user
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        criteria.username = filterBy.txt
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: +filterBy.minBalance }
    }
    return criteria;
}


