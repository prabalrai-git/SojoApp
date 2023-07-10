import axios from 'axios';

// const API_BASE_URL = 'https://backend.sojonews.com/api/v1';

const API_BASE_URL = 'http://192.168.0.103:5000/api/v1';
// const API_BASE_URL = 'https://latestbackend.sojonews.com/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
});

export default client;
