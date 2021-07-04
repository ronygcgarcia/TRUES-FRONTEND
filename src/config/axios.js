import axios from 'axios';

export const getAccessToken = () =>
  localStorage.getItem('token');

const api = axios.create({
    headers: {
        common: {
          Authorization: `Bearer ${getAccessToken()}`,          
        },
        "X-Requested-With":"XMLHttpRequest"
      },
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
})

export default api;