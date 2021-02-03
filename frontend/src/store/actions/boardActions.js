import { boardService } from '../../services/boardService';
import { socketService } from '../../services/socketService';

// Action Dispatcher

// BOARD //
export function loadBoards(filterBy) {
  return async dispatch => {
    try {
      const boards = await boardService.query(filterBy);
      dispatch({ type: 'SET_BOARDS', boards });
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function getBoardById(boardId) {
  return async dispatch => {
    try {
      const board = await boardService.getBoardById(boardId)
      dispatch({ type: 'SET_BOARD', board })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function setBoard(boardId) {
  return async dispatch => {
    try {
      const board = await boardService.getBoardById(boardId);
      dispatch({ type: 'SET_BOARD', board });
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function removeBoard(boardId) {
  return async dispatch => {
    try {
      await boardService.removeBoard(boardId);
      dispatch({ type: 'REMOVE_BOARD', boardId })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function addBoard(board) {
  return async dispatch => {
    try {
      const savedBoard = await boardService.addBoard(board);
      dispatch({ type: 'ADD_BOARD', board: savedBoard });
      return savedBoard;
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function updateBoard(board) {
  return async dispatch => {
    try {
      const savedBoard = await boardService.updateBoard(board);
      dispatch(_boardUpdate(savedBoard));
      dispatch({ type: 'SET_BOARD', board: savedBoard })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function favoriteBoard(boardId, isStarred) {
  return async dispatch => {
    try {
      await boardService.favoriteBoard(boardId, isStarred);
      const board = boardService.getBoardById(boardId);
      dispatch(_boardUpdate(board));
      return board;
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}


// LIST //
export function addList(boardId, list) {
  return async dispatch => {
    try {
      await boardService.addList(boardId, list);
      const board = await boardService.getBoardById(boardId);
      dispatch(_boardUpdate(board));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function deleteList(boardId, listId) {
  return async dispatch => {
    try {
      await boardService.deleteList(boardId, listId);
      const board = await boardService.getBoardById(boardId);
      dispatch(_boardUpdate(board));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}


function _boardUpdate(board) {
  socketService.emit('savedBoard', board._id);
  return {
    type: 'UPDATE_BOARD',
    board
  }
}