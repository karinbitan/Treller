import httpService from './httpService';
export const userService = {
    query,
    getUserById,
    updateUser,
    getEmptyUser
}

function query() {
    return httpService.get('user');
}

function getUserById(userId) {
    return httpService.get(`user/${userId}`);
}

function updateUser(user) {
    return httpService.put(`user/${user._id}`, user);
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


