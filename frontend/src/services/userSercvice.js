import httpService from './httpService';
export const userService = {
    query,
    getUserById,
    updateUser,
    getEmptyUser
}

function query(filter = null) {
    debugger
    // var filterStr = '';
    // if (filter) {
    //     const searchStr = (filter.txt) ? `&txt=${filter.txt}` : '';
    //     filterStr = searchStr;
    // }
    // return httpService.get(`user?${filterStr}`);
    return httpService.get(`user`);
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


