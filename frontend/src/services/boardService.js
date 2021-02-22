import { httpService } from './httpService';

export const boardService = {
    query,
    getBoardById,
    getBoardForBoardPage,
    deleteBoard,
    addBoard,
    updateBoard,
    getEmptyBoard,
    addList,
    deleteList,
    updateListTitle,
    getEmptyList,
    addMemberToBoard,
    updateBoardCollection,
    deleteCardFromList,
    inviteMemberToBoard
}

// BOARD //
function query() {
    return httpService.get(`board`);
}

function getBoardById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function getBoardForBoardPage(boardId) {
    return httpService.get(`board/${boardId}/boardPage`);
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

function inviteMemberToBoard(board, member) {
    return httpService.post(`board/${board._id}/invite`, { board, member })
}

function addMemberToBoard(boardId, member) {
    return httpService.post(`board/${boardId}/add`, member)
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
        description: '',
        members: [],
        lists: [],
        activities: [],
        isTemplate: false
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

function updateListTitle(boardId, listIdx, title) {
    return httpService.patch(`board/${boardId}/list/${listIdx}`, {title});
}

// CARD //
function deleteCardFromList(boardId, listIdx, cardId) {
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

