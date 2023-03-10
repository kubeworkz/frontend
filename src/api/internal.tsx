import { Api as ApiClient } from './generated/api';
import { API_HOST } from './config';
import { getCSRFToken } from '../utils/getCSRFToken';

const internalApiService = new ApiClient({
  baseURL: API_HOST,
  headers: {
    'X-CSRF-Token': getCSRFToken(),
    accept: 'application/json',
  },
});

export { internalApiService };
export * from './generated/api';
