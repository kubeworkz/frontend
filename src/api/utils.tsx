import axios, { AxiosError, CancelTokenSource } from 'axios';
import { getCSRFToken } from '#shared/utils/getCSRFToken';
import { toast } from 'react-toastify';
import { ToastError } from '#shared/components/Toast/Toast';
import React, { useRef, useState } from 'react';
import { debounce, throttle } from 'throttle-debounce';
import { conformsTo } from '#shared/utils/set';

const csrf = getCSRFToken();
const SESSION_COOKIE = 'zenith';

export const logout = () => {
  const formData = new FormData();

  formData.append('_method', 'delete');
  formData.append('authenticity_token', csrf);

  return axios.post('/sign_out', formData, {
    headers: {
      'X-CSRF-Token': getCSRFToken(),
    },
  });
};

export const logoutViaCookie = () => {
  document.cookie = `${SESSION_COOKIE}=;`;
  window.location.reload();
};

export const createErrorText = (err: AxiosError) => `Request failed with status ${err.response?.status}: ${err.response?.data.message || err.response?.data.error || err.response?.statusText || 'unknown error'}`;

export const apiErrorToaster = (err: AxiosError | any, id?: string) => {
  const errText = err.response ? createErrorText(err) : err.toString();
  toast(<ToastError
    body={errText}
  />, {
    toastId: id,
  });
};

export function debounceApiRequest<T extends (...args: any[]) => any>(fn: T): T {
  return debounce(100, fn);
}

export function useThrottledApiRequest<T extends (...args: any[]) => any>(fn: T, timeout = 1000) {
  return useState(() => throttle(timeout, fn))[0];
}

export const useCancelToken = () => {
  const tokenRef = useRef<CancelTokenSource>();

  const cancel = () => {
    tokenRef.current?.cancel();
  };

  const create = () => {
    tokenRef.current = axios.CancelToken.source();

    return tokenRef.current.token;
  };

  return {
    cancel,
    create,
  };
};

export const endpointStates = [
  'init',
  'active',
  'idle',
  'stopped',
] as const;

export type EndpointStateStrict = typeof endpointStates[number];
export type EndpointTransitionEdge = `${EndpointStateStrict}_${EndpointStateStrict}`;

export const conformEndpointState = conformsTo(new Set(endpointStates));
