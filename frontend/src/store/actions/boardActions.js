import { boardService } from '../../services/boardService';

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
      return board;
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

export function updateBoardCollection(board, updatedObject) {
  return async dispatch => {
    try {
      const savedBoard = await boardService.updateBoardCollection(board, updatedObject);
      dispatch(_boardUpdate(savedBoard));
      dispatch({ type: 'SET_BOARD', board: savedBoard })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}


export function addMemberToBoard(board, member) {
  return async dispatch => {
    try {
      const realBoard = await boardService.addMemberToBoard(board, member);
      dispatch(_boardUpdate(realBoard));
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
  return {
    type: 'UPDATE_BOARD',
    board
  }
}