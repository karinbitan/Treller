const INITIAL_STATE = {
  searchResult: [],
}

export function searchReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case 'SET_RESULT':
      return {
        ...state,
        searchResult: action.searchResult
      }
    default:
      return state
  }
}
