import axios from 'axios';

const REACT_BACK_END_APP_BASE_URL = 'http://localhost:8080' || import.meta.env.VITE_BACK_END_APP_BASE_URL;

const getAuthApi = () => {
    return axios.create({
        baseURL: REACT_BACK_END_APP_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        }
    });
}


const getApi = () => {
    const token = localStorage.getItem('token');

    return axios.create({
        baseURL: REACT_BACK_END_APP_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': `Bearer ${token}`
        }
    });
};



export { getAuthApi, getApi };