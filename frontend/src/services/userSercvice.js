import {httpService} from './httpService';
export const userService = {
    query,
    getUserById,
    updateUser,
    getEmptyUser,
    updateUserCollection,
    addUserNotification,
    addBoardToFavorite,
    removeBoardFromFavorite
}

function query(filter = null) {
    var filterStr = '';
    if (filter) {
        const searchStr = (filter.txt) ? `&txt=${filter.txt}` : '';
        filterStr = searchStr;
    }
    return httpService.get(`user?${filterStr}`);
}

function getUserById(userId) {
    return httpService.get(`user/${userId}`);
}

function updateUser(user) {
    return httpService.put(`user/${user._id}`, user);
}

function updateUserCollection(userId, updatedObject) {
    return httpService.patch(`user/${userId}`, updatedObject);
}

function addUserNotification(userId, notification) {
    return httpService.post(`user/${userId}/notification`, notification);
}

function addBoardToFavorite(userId, boardId) {
    return httpService.post(`user/${userId}/favoriteBoards`, {boardId});
}

function removeBoardFromFavorite(userId, boardId) {
    return httpService.patch(`user/${userId}/favoriteBoards`, {boardId});
}

function getEmptyUser() {
    const user = {
        fullName: '',
        userName: '',
        password: '',
        imgUrl: '',
        boardsOwner: [],
        boardsMember: [],
        cardsMember : [],
        favoriteBoards: [],
        notifications: []
    }
    return user;
}


