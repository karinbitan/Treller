const logger = require('../services/logger.service');

async function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized!');
    return;
  }
  next();
}
async function requireBoardOwner(req, res, next) {
  const user = req.session.user;
  const id = req.session.board._id;
  const isAdmin = user.boardsOwner.some(boardId => {
    return boardId === id;
  });
  if (!isAdmin) {
    res.status(403).end('Unauthorized Enough..');
    return;
  }
  next();
}

// async function requireUser(req, res, next) {
//   const user = req.session.user;
//   if (!user.isAdmin) {
//     res.status(403).end('Unauthorized Enough..');
//     return;
//   }
//   next();
// }


// module.exports = requireAuth;

module.exports = {
  requireAuth,
  requireBoardOwner
}
