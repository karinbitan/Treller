const INITIAL_STATE = {
  boards: [],
  currBoard: null
}

export function boardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_BOARDS':
      return {
        ...state,
        boards: action.boards
      }
    case 'SET_BOARD':
      return {
        ...state,
        currBoard: action.board
      }
    case 'REMOVE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(board => board._id !== action.boardId)
      }
    case 'ADD_BOARD':
      return {
        ...state,
        boards: [...state.boards, action.board]
      }
    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(board => board._id === action.board._id ? action.board : board)
      }
    default:
      return state
  }
}

