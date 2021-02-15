import { httpService } from './httpService';

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

function deleteCard(cardId) {
    return httpService.delete(`card/${cardId}`);
}

function addCard(boardId, listId, listIdx, card) {
    return httpService.post(`card/`, { boardId, listId, listIdx, card });
}

function updateCard(boardId, card) {
    return httpService.put(`card/${boardId}/${card._id}`, card);
}

function updateCardCollection(boardId, cardId, updatedObject) {
    return httpService.patch(`card/${boardId}/${cardId}`, updatedObject);
}

function addComment(cardId, comment) {
    return httpService.post(`card/${cardId}/comments`, comment);
}

function deleteComment(cardId, commentId) {
    debugger
    return httpService.delete(`card/comments/${cardId}/${commentId}`);
}

function addTodo(cardId, checklistIdx, todo) {
    return httpService.post(`card/${cardId}/${checklistIdx}/todos`, todo);
}

function deleteTodo(cardId, checklistIdx, todoIdx) {
    return httpService.delete(`card/${cardId}/checklists/${checklistIdx}/todos/${todoIdx}`);
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
