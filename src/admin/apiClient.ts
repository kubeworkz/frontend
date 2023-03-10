import axios from 'axios';
import { getCSRFToken } from '../utils/getCSRFToken';

export const api = axios.create({
  baseURL: '/admin',
  headers: {
    'X-CSRF-Token': getCSRFToken(),
  },
});
