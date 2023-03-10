import { API_V2_HOST } from './config';
import { getCSRFToken } from '../utils/getCSRFToken';
import {
  Api,
  ContentType,
} from './generated/api_public_v2';

export const apiService = new Api({
  baseURL: API_V2_HOST,
  headers: {
    accept: ContentType.Json,
    'X-CSRF-Token': getCSRFToken(),
  },
});

export * from './generated/api_public_v2';
