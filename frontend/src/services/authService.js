import HttpService from './HttpService';

export const authService = {
    login,
    signup,
    logout,
    getLoggedInUser
}

// async function login(userCred) {
//     const user = await axios.post(`${BASE_URL}/login`, userCred);
//     if (!user) {
//         throw Error('login failed')
//     }
//     return _handleLogin(user)
// }

// async function signup(userCred) {
//     const user = await axios.post(`${BASE_URL}/signup`, userCred);
//     return _handleLogin(user)
// }

// async function logout() {
//     await axios.post(`${BASE_URL}/logout`);
//     sessionStorage.clear();
// }

// async function getLoggedInUser() {
//     const user = await axios.get(`${BASE_URL}/user`);
//     debugger
//     return user.data;
// }

async function login(userCred) {
    try {
        const user = await HttpService.post('auth/login', userCred);
        return user;
    } catch (err) {
        console.log('UserService: err in login', err);
    }
}

async function signup(userCred) {
    try {
        const user = await HttpService.post('auth/signup', userCred);
        return user;
    } catch (err) {
        console.log('UserService: err in signup', err);
    }
}

async function logout() {
    try {
        await HttpService.post('auth/logout');
    } catch (err) {
        console.log('UserService: err in logout', err);
    }
}

async function getLoggedInUser() {
    try {
        const user = await HttpService.get('auth/user');
        return user;
    } catch (err) {
        console.log('UserService: err in getting loggedInUser', err);
    }
}


// function _handleLogin(user) {
//     sessionStorage.setItem('user', JSON.stringify(user.data))
//     return user.data;
// }