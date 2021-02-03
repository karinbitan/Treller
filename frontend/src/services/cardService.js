import {httpService} from './httpService';

export const cardService = {
    query,
    getCardById,
    deleteCard,
    addCard,
    updateCard,
    getEmptyCard,
    addComment,
    deleteComment
}

function query(filter = null) {
    debugger
    var filterStr = '';
    if (filter) {
        const searchStr = (filter.txt) ? `&txt=${filter.txt}` : '';
        filterStr = searchStr;
    }
    return httpService.get(`card?_sort=${filterStr}`);
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
    return httpService.put(`card/${card._id}`, card);
}

function addComment(cardId, comment) {
    return httpService.post(`card/${cardId}/comments`, comment);
}

function deleteComment(cardId, commentId) {
    return httpService.post(`card/${cardId}/comments/${commentId}`);
}

function getEmptyCard() {
    const card = {
        title: '',
        description: '',
        members: [],
        comments: [],
        checklist: [],
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
