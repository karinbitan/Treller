import { httpService } from './httpService';
import { socketService } from './socketService';

export const cardService = {
    query,
    getCardById,
    deleteCard,
    addCard,
    updateCard,
    updateCardCollection,
    getEmptyCard,
    addComment,
    deleteComment,
    addTodo,
    deleteTodo
}

function query(filter = null) {
    // var filterStr = '';
    // if (filter) {
    //     const searchStr = (filter.txt) ? `&txt=${filter.txt}` : '';
    //     filterStr = searchStr;
    // }
    // return httpService.get(`card?=${filterStr}`);
    return httpService.get(`card`);
}

function getCardById(cardId) {
    return httpService.get(`card/${cardId}`);
}

function deleteCard(boardId, listIdx, cardId) {
    return httpService.delete(`card/${boardId}/${listIdx}/${cardId}`);
}

function addCard(boardId, listId, listIdx, card) {
    return httpService.post(`card/`, { boardId, listId, listIdx, card });
}

function updateCard(card) {
    socketService.emit('savedCard', card._id);
    return httpService.put(`card/${card._id}`, card);
}

function updateCardCollection(cardId, updateObject) {
    return httpService.patch(`card/${cardId}`, updateObject);
}

function addComment(cardId, comment) {
    return httpService.post(`card/${cardId}/comments`, comment);
}

function deleteComment(cardId, commentId) {
    return httpService.delete(`card/${cardId}/comments/${commentId}`);
}

function addTodo(cardId, checklistIdx, todo) {
    debugger
    return httpService.post(`card/${cardId}/${checklistIdx}/todos`, todo);
}

function deleteTodo(cardId, checklistIdx, todoIdx) {
    return httpService.delete(`card/${cardId}/${checklistIdx}/todos/${todoIdx}`);
}


function getEmptyCard() {
    const card = {
        title: '',
        description: '',
        members: [],
        comments: [],
        checklists: [],
        labels: [],
        dueDate: '',
        isComplete: false,
        createdAt: Date.now(),
        createdBy: {
            userId: '',
            boardId: '',
            listId: '',
        },
        style: {}
    }
    return card;
}
