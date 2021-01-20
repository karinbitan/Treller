const INITIAL_STATE = {
  cards: [],
  currCard: null
}
export function cardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_CARDS':
      return {
        ...state,
        cards: action.cards
      }
    case 'SET_CARD':
      return {
        ...state,
        currCard: action.card
      }
    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(card => card._id !== action.cardId)
      }
    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.card]
      }
      case 'UPDATE_CARD':
        return {
          ...state,
          cards: state.cards.map(card => card._id === action.card._id ? action.card : card)
        }
    default:
      return state
  }
}