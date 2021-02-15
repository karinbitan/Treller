import { httpService } from './httpService';

export const boardService = {
    query,
    getBoardById,
    deleteBoard,
    addBoard,
    updateBoard,
    getEmptyBoard,
    addList,
    deleteList,
    getEmptyList,
    addMemberToBoard,
    updateBoardCollection,
    deleteCard,
    addBoardNotification
}

// BOARD //
function query() {
    return httpService.get(`board`);
}

function getBoardById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function deleteBoard(boardId) {
    return httpService.delete(`board/${boardId}`);
}

function addBoard(board) {
    return httpService.post(`board`, board);
}

function updateBoard(board) { 
    return httpService.put(`board/${board._id}`, board);
}

function updateBoardCollection(boardId, updatedObject) {
    return httpService.patch(`board/${boardId}`, updatedObject)
}

function addMemberToBoard(boardId, member) {
    return httpService.post(`board/${boardId}`, member)
}

function addBoardNotification(boardId, notification) {
    return httpService.post(`board/${boardId}/notification`, notification);
}

function getEmptyBoard() {
    const board = {
        title: 'New Board',
        createdAt: Date.now(),
        createdBy: {},
        style: {
            backgroundColor: 'rgb(0, 121, 191)',
            backgroundImg: null
        },
        members: [],
        lists: [],
        activities: [],
        isFavorite: false,
        isTemplate: false,
        notifications: []
    }
    return board;
}

// LIST //
function addList(boardId, list) {
    return httpService.post(`board/${boardId}/list`, list);
}

function deleteList(boardId, listId) {
    return httpService.delete(`board/${boardId}/list/${listId}`);
}

// CARD //
function deleteCard(boardId, listIdx, cardId) {
    return httpService.delete(`board/${boardId}/list/${listIdx}/card/${cardId}`);
}

function getEmptyList() {
    const list = {
        title: '',
        cards: [],
        style: ''
    }
    return list;
}

