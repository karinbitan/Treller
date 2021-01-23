const INITIAL_STATE = {
  users: [],
  loggedInUser: null
}

export function userReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.users
      }
    case 'SET_USER':
      return {
        ...state,
        loggedInUser: action.user
      }
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.userId)
      }
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.user]
      }
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => user._id === action.user._id ? action.user : user)
      }
    default:
      return state
  }
}