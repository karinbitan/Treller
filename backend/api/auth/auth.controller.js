const authService = require('./auth.service');
const logger = require('../../services/logger.service');

async function login(req, res) {
    const { userName, password } = req.body;
    try {
        const user = await authService.login(userName, password);
        req.session.user = user;
        req.session.save();
        res.json(user);
    } catch (err) {
        res.status(401).send({ error: err });
    }
}

async function signup(req, res) {
    try {
        const { userName, password } = req.body;
        const account = await authService.signup(req.body);
        const user = await authService.login(userName, password);
        req.session.user = user;
        // req.session.save();
        res.json(user);
    } catch (err) {
        logger.error('[SIGNUP] ' + err);
        res.status(500).send({ error: err });
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}

async function getLoggedInUser(req, res) {
    try {
        if (req.session.user) {
            res.json(req.session.user);
        }
    } catch (err) {
        // res.json({});
        logger.error('no signedin users', err);
        res.status(500).send({ error: 'no signedin users' });
    }
}

module.exports = {
    login,
    signup,
    logout,
    getLoggedInUser
}