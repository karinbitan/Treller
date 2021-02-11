import { httpService } from './httpService';
import { socketService } from './socketService';

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
    addMemberToBoard,
    updateBoardCollection
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
    socketService.emit('savedBoard', board._id);
    return httpService.put(`board/${board._id}`, board);
}

function updateBoardCollection(board, updatedObject) {
    socketService.emit('savedBoard', board._id); 
    return httpService.patch(`board/${board._id}`, { updatedObject })
}

function addMemberToBoard(board, member) {
    return httpService.post(`board/${board._id}`, member)
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
        isTemplate: false
    }
    return board;
}

// LIST //

function addList(boardId, list) {
    socketService.emit('savedBoard', boardId); 
    return httpService.post(`board/${boardId}/list`, list);
}
function deleteList(boardId, listId) {
    socketService.emit('savedBoard', boardId); 
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

