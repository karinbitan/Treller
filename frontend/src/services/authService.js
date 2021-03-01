import {httpService} from './httpService';

export const authService = {
    login,
    signup,
    logout,
    getLoggedInUser
}

async function login(userCred) {
    debugger
    try {
        const user = await httpService.post('auth/login', userCred);
        if (!user) {
            console.log('no user - service')
            throw Error('login failed')
        }
        debugger
        return user;
    } catch (err) {
        console.log('UserService: err in login', err);
    }
}

async function signup(userCred) {
    debugger
    try {
        const user = await httpService.post('auth/signup', userCred);
        if (!user) {
            console.log('no user - service')
            throw Error('login failed')
        }
        debugger
        return user;
    } catch (err) {
        console.log('UserService: err in signup', err);
    }
}

async function logout() {
    try {
        await httpService.post('auth/logout');
    } catch (err) {
        console.log('UserService: err in logout', err);
    }
}

async function getLoggedInUser() {
    try {
        const user = await httpService.get('auth/user');
        return user;
    } catch (err) {
        console.log('UserService: err in getting loggedInUser', err);
    }
}


// function _handleLogin(user) {
//     sessionStorage.setItem('user', JSON.stringify(user.data))
//     return user.data;
// }