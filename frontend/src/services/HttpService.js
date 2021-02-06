import Axios from 'axios';
var axios = Axios.create({
    withCredentials: true
});

const BASE_URL = process.env.NODE_ENV === 'production' ?
    '/api/' :
    '//localhost:4000/api/'

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    },
    patch(endpoint, data) {
        return ajax(endpoint, 'PATCH', (data))
    }
}


async function ajax(endpoint, method = 'get', data = null) {
    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data
        })
        return res.data;
    } catch (err) {
        if (err.response.status === 401) {
            this.props.history.push('/');
        }
        console.log(`Had issues ${method}ing to server`, err)
        throw err;
    }
}