const authService = require('./auth.service');
const userService = require('./../user/user.service');

async function login(req, res) {
    const { userName, password } = req.body;
    try {
        const user = await authService.login(userName, password);
        req.session.user = user;
        // req.session.save();
        res.json(user);
    } catch (err) {
        res.status(401).send({ error: err });
        // next({status: 500, message: err})
    }
}

async function signup(req, res) {
    try {
        const { userName, password } = req.body;
        await authService.signup(req.body);
        const user = await authService.login(userName, password);
        req.session.user = user;
        // req.session.save();
        res.json(user);
    } catch (err) {
        res.status(500).send({ error: err });
        // next({status: 500, message: err})
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
        // next({status: 500, message: err})
    }
}

async function getLoggedInUser(req, res) {
    try {
        if (req.session.user) {
            const user = await userService.getUserById(req.session.user._id);
            req.session.user = user;
            res.json(user);
        } else {
            res.status(401).send('User not authorized');
            // next({status: 500, message: err})
        }
    } catch (err) {
        // next({status: 500, message: err})
        res.status(500).send({ error: 'no signedin users' });
    }
}

module.exports = {
    login,
    signup,
    logout,
    getLoggedInUser
}