import axios from 'axios';

const api = axios.create({
    baseURL: 'c',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;