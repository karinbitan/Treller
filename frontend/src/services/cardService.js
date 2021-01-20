import HttpService from './HttpService';

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

function query() {
    return HttpService.get(`card/`);
}

function getCardById(cardId) {
    return HttpService.get(`card/${cardId}`);
}

function deleteCard(boardId, listIdx, cardId) {
    return HttpService.delete(`card/${boardId}/${listIdx}/${cardId}`);
}

function addCard(boardId, listIdx, card) {
    return HttpService.post(`card/`, { boardId, listIdx, card });
}

function updateCard(card) {
    return HttpService.put(`card/${card._id}`, card);
}

function addComment(cardId, comment) {
    return HttpService.post(`card/${cardId}/comments`, comment);
}

function deleteComment(cardId, commentId) {
    return HttpService.delete(`card/${cardId}/comments/delete`, { commentId });
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
        createdAt: Date.now(),
        byMember: [],
        style: ''
    }
    return card;
}
