import HttpService from './HttpService';
export const userService = {
    query,
    getUserById,
    getEmptyUser
}

function query() {
    return HttpService.get('user');
}

function getUserById(userId) {
    return HttpService.get(`user/${userId}`);
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


