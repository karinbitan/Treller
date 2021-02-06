import { httpService } from './httpService';

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
    return httpService.get(`board`);
}

function getBoardById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function removeBoard(boardId) {
    return httpService.delete(`board/${boardId}`);
}

function addBoard(board) {
    return httpService.post(`board`, board);
}

function updateBoard(board) {
    return httpService.put(`board/${board._id}`, board);
}

function favoriteBoard(boardId, isStarred) {
    return httpService.post(`board/${boardId}`, { isStarred })
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
        isFavorite: false
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

function getEmptyList() {
    const list = {
        title: '',
        cards: [],
        style: ''
    }
    return list;
}

