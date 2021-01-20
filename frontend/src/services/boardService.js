import HttpService from './HttpService';

export const boardService = {
    query,
    getBoardById,
    removeBoard,
    addBoard,
    updateBoard,
    getEmptyBoard,
    addList,
    deleteList,
    getEmptyList,
    favoriteBoard
}

// BOARD //
function query() {
    return HttpService.get(`board`);
}

function getBoardById(boardId) {
    return HttpService.get(`board/${boardId}`);
}

function removeBoard(boardId) {
    return HttpService.delete(`board/${boardId}`);
}

function addBoard(board) {
    return HttpService.post(`board/${board._id}`, board);
}

function updateBoard(board) {
    return HttpService.put(`board/${board._id}`, board);
}

function favoriteBoard(boardId, isStarred) {
    return HttpService.post(`board/${boardId}`, {isStarred})
}

function getEmptyBoard() {
    const board = {
        title: '',
        createdAt: Date.now(),
        createdBy: {},
        style: '',
        members: [],
        lists: [],
        activities: []
    }
    return board;
}

// LIST //

function addList(boardId, list) {
    return HttpService.post(`board/${boardId}/list`, list);
}
function deleteList(boardId, listId) {
    return HttpService.delete(`board/${boardId}/list/${listId}`);
}

function getEmptyList() {
    const list = {
        title: '',
        cards: [],
        style: ''
    }
    return list;
}

