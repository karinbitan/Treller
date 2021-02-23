const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express()

const http = require('http').createServer(app, {
    cors: {
        origin: '*',
    }
});
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
})

module.exports = {
    socketConnection: io
};

// Express App Config
app.use(cookieParser())
app.use(bodyParser.json());
let sessionOptions = {
    secret: 'CaSep2020 Secret Token 3287323',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false
    }
}

app.use(session(sessionOptions))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:4000', 'http://localhost:4000', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true,
        exposedHeaders: ['set-cookie']
    };
    app.use(cors(corsOptions));
}

const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const boardRoutes = require('./api/board/board.routes');
const cardRoutes = require('./api/card/card.routes');
const searchRoutes = require('./api/search/search.routes');
const { listenToSocketEvents } = require('./api/socket/socket.routes');

app.use((err, req, res, next) => {
    res.status(500).json({
        error: "Got an error"
    })
})

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/search', searchRoutes);

listenToSocketEvents(io)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 4000;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
});