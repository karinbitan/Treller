const userService = require('./user.service')
const logger = require('../../services/logger.service')


async function getUsers(req, res) {
    try {
        const users = await userService.query(req.query)
        res.send(users)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function getUserById(req, res) {
    try {
        const user = await userService.getUserById(req.params.id)
        res.send(user)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function deleteUser(req, res) {
    try {
        await userService.delete(req.params.id)
        res.end()
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}

async function updateUser(req, res) {
    const user = req.body;
    try {
        await userService.update(user)
        res.send(user)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        throw err;
    }
}


module.exports = {
    getUserById,
    getUsers,
    deleteUser,
    updateUser
}