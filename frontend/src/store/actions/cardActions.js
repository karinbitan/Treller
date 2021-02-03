import { cardService } from '../../services/cardService';
import { socketService } from '../../services/socketService';

// Action Dispatcher

export function loadCards(filterBy) {
  return async dispatch => {
    try {
      const cards = await cardService.query(filterBy);
      dispatch({ type: 'SET_CARDS', cards });
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function setCard(cardId) {
  return async dispatch => {
    try {
      const card = await cardService.getCardById(cardId)
      dispatch({ type: 'SET_CARD', card })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function deleteCard(boardId, listIdx, cardId) {
  return async dispatch => {
    try {
      await cardService.deleteCard(boardId, listIdx, cardId);
      dispatch({ type: 'DELETE_CARD', cardId })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function addCard(boardId, listId, listIdx, card) {
  return async dispatch => {
    try {
      const savedCard = await cardService.addCard(boardId, listId, listIdx, card);
      dispatch({ type: 'ADD_CARD', card: savedCard });
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function updateCard(card) {
  return async dispatch => {
    try {
      debugger
      const savedCard = await cardService.updateCard(card)
      dispatch(_cardUpdate(savedCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function addComment(cardId, comment) {
  return async dispatch => {
    try {
      const realCard = await cardService.addComment(cardId, comment);
      const savedCard = await cardService.updateCard(realCard);
      dispatch(_cardUpdate(savedCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function deleteComment(cardId, commentId) {
  return async dispatch => {
    try {
      const realCard = await cardService.deleteComment(cardId, commentId);
      const savedCard = await cardService.updateCard(realCard);
      dispatch(_cardUpdate(savedCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

function _cardUpdate(card) {
  socketService.emit('savedCard', card._id);
  return {
    type: 'UPDATE_CARD',
    card
  }
}