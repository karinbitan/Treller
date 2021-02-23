const userService = require('./user.service')


async function getUsers(req, res) {
    try {
        const users = await userService.query(req.query)
        res.send(users)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({status: 500, message: err})
    }
}

async function getUserById(req, res) {
    try {
        const user = await userService.getUserById(req.params.id)
        res.send(user)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({status: 500, message: err})
    }
}

async function deleteUser(req, res) {
    try {
        await userService.delete(req.params.id)
        res.end()
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({status: 500, message: err})
    }
}

async function updateUser(req, res) {
    const user = req.body;
    try {
        const savedUser = await userService.updateUser(user)
        res.send(savedUser)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({status: 500, message: err})
    }
}

async function updateUserCollection(req, res) {
    const userId = req.params.id;
    const updatedObject = req.body;
    try {
        await userService.updateUserCollection(userId ,updatedObject)
        const realUser = await userService.getUserById(userId);
        res.send(realUser)
    } catch (err) {
        console.log(`ERROR: ${err}`)
        next({status: 500, message: err})
    }
}

module.exports = {
    getUserById,
    getUsers,
    deleteUser,
    updateUser,
    updateUserCollection
}