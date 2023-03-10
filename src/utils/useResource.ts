import { useState } from 'react';

export type ResourceState<T> = {
  data?: T | never;
  isLoading: boolean;
  error?: string | never;
} | {
  data: T;
  isLoading: false;
  error: never;
} | {
  isLoading: false;
  error: string;
  data?: never;
};

export function useResource<T = any>(initialState?: ResourceState<T>) {
  return useState<ResourceState<T>>(initialState || {
    isLoading: true,
  });
}
