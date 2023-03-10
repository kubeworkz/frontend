import { useState } from 'react';
import {
  ApiKeyCreateRequest,
  ApiKeyCreateResponse,
  ApiKeysListResponseItem,
  apiService as apiV2Service,
} from '#api_client/publicv2';
import { useConfirmation } from '#shared/components/Confirmation/ConfirmationProvider';
import { apiErrorToaster } from '#api_client/utils';

export const useApiKeys = () => {
  const { confirm } = useConfirmation();
  const [state, setState] = useState<{
    list: ApiKeysListResponseItem[];
    error?: string;
    isLoading: boolean;
  }>({
    list: [],
    isLoading: false,
  });
  const [newToken, setNewToken] = useState<ApiKeyCreateResponse>();

  const get = () => apiV2Service
    .listApiKeys()
    .then(
      ({ data: list }) => setState({ list, isLoading: false }),
    )
    .catch(() => setState({ error: 'Error', isLoading: false, list: [] }));

  const revoke = (id: any) => confirm({
    header: 'Are you sure?',
    confirmButtonText: 'Revoke',
  }).then(() => apiV2Service.revokeApiKey(id)).then(() => {
    if (newToken && newToken.id === id) {
      setNewToken(undefined);
    }
    get();
  }, apiErrorToaster);
  const create = (data: ApiKeyCreateRequest) => apiV2Service
    .createApiKey(data)
    .then(({ data: token }) => {
      setNewToken(token);
      get();
    }, apiErrorToaster);

  return {
    state,
    newToken,
    onCreateToken: setNewToken,
    revoke,
    create,
    get,
  };
};
