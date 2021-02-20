import { cardService } from '../../services/cardService';
import { boardService } from '../../services/boardService';

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
      await boardService.deleteCardFromList(boardId, listIdx, cardId);
      await cardService.deleteCard(cardId);
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

export function updateCard(boardId, card) {
  return async dispatch => {
    try {
      const savedCard = await cardService.updateCard(boardId, card)
      dispatch(_cardUpdate(savedCard));
      dispatch({ type: 'SET_CARD', card: savedCard })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function updateCardCollection(cardId, updateObject) {
  return async dispatch => {
    try {
      const savedCard = await cardService.updateCardCollection(cardId, updateObject)
      dispatch(_cardUpdate(savedCard));
      dispatch({ type: 'SET_CARD', card: savedCard })
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function addCardMember(cardId, member) {
  return async dispatch => {
    try {
      const realCard = await cardService.addCardMember(cardId, member);
      dispatch(_cardUpdate(realCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function addComment(cardId, comment) {
  return async dispatch => {
    try {
      const realCard = await cardService.addComment(cardId, comment);
      dispatch(_cardUpdate(realCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function deleteComment(cardId, commentId) {
  return async dispatch => {
    try {
      const realCard = await cardService.deleteComment(cardId, commentId);
      dispatch(_cardUpdate(realCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function addTodo(cardId, checklistIdx, todo) {
  return async dispatch => {
    try {
      const realCard = await cardService.addTodo(cardId, checklistIdx, todo);
      dispatch(_cardUpdate(realCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

export function deleteTodo(cardId, checklistIdx, todoId) {
  return async dispatch => {
    try {
      const realCard = await cardService.deleteTodo(cardId, checklistIdx, todoId);
      dispatch(_cardUpdate(realCard));
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
}

function _cardUpdate(card) {
  return {
    type: 'UPDATE_CARD',
    card
  }
}