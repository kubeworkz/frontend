import { Api as ApiClient } from '#api_client/generated/api';
import { API_HOST } from '#api_client/config';
import { getCSRFToken } from '#shared/utils/getCSRFToken';

const internalApiService = new ApiClient({
  baseURL: API_HOST,
  headers: {
    'X-CSRF-Token': getCSRFToken(),
    accept: 'application/json',
  },
});

export { internalApiService };
export * from '#api_client/generated/api';
