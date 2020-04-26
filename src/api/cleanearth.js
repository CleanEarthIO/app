import axios from 'axios';

const cleanearth = axios.create({
  baseURL: 'https://cleanearth.io/',
});

export default cleanearth;
