import httpService from './httpService';
export const userService = {
    query,
    getUserById,
    getEmptyUser
}

function query() {
    return httpService.get('user');
}

function getUserById(userId) {
    return httpService.get(`user/${userId}`);
}

function getEmptyUser() {
    const user = {
        fullName: '',
        userName: '',
        password: '',
        imgUrl: ''
    }
    return user;
}


