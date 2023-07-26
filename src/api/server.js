import axios from 'axios';

const API_BASE_URL = 'https://backendv1.sojonews.com/api/v1';

// const API_BASE_URL = 'http://192.168.0.110:3030/api/v1';
// const API_BASE_URL = 'https://latestbackend.sojonews.com/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
});

export default client;
