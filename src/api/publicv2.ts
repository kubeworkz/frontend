import { API_V2_HOST } from '#api_client/config';
import { getCSRFToken } from '#shared/utils/getCSRFToken';
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

export * from '#api_client/generated/api_public_v2';
