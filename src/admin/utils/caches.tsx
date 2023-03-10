import React, { PropsWithChildren, useState } from 'react';
import {
  AdminPageserver, AdminUser, AdminSafekeeper, internalApiService,
} from '#api_client/internal';

interface CreateCacheOptions<T, D> {
  load(id: T): Promise<D>;
}

export interface CacheDataItem<T, D> {
  id: T;
  data?: D;
  isLoading: boolean;
  error?: string;
}

export type CacheDataId = string | number | symbol;

type CacheState<T extends CacheDataId, D> = Record<T, CacheDataItem<T, D>>;

interface CacheContextInterface<T extends string | number | symbol, D> {
  get(id: T): void;
  data: CacheState<T, D>;
}

export interface CreateCacheReturn<T, D> {
  useCache: (id: T) => {
    data: CacheDataItem<T, D>;
    get(): void;
  };
  CacheProvider: React.ComponentType<{
    children: React.ReactNode;
  }>;
}

export function createCache<T extends string | number | symbol, D extends { id: T }>({
  load,
}: CreateCacheOptions<T, D>): CreateCacheReturn<T, D> {
  const Context = React.createContext<CacheContextInterface<T, D> | null>(null);

  const CacheProvider = ({ children }: PropsWithChildren<{}>) => {
    const [cache, setCache] = useState<CacheState<T, D>>({} as CacheState<T, D>);

    const scheduleLoad = React.useCallback((id: T) => {
      load(id).then((data) => {
        setCache((prevCache) => ({
          ...prevCache,
          [id]: {
            id,
            data,
            isLoading: false,
          },
        }));
      }).catch((error) => {
        setCache((prevCache) => ({
          ...prevCache,
          [id]: {
            id,
            isLoading: false,
            error: error.message,
          },
        }));
      });
    }, []);

    const get = React.useCallback((id: T) => {
      if (cache[id] && !cache[id].error) {
        return cache[id];
      }

      scheduleLoad(id);

      const newCacheItem: CacheDataItem<T, D> = {
        id,
        isLoading: true,
      };
      setCache((prev: CacheState<T, D>) => ({
        ...prev,
        [id]: newCacheItem,
      }));

      return newCacheItem;
    }, [cache, load]);

    return (
      <Context.Provider value={{ get, data: cache }}>
        {children}
      </Context.Provider>
    );
  };

  const useCache = (id: T) => {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error('useCache must be used within a CacheProvider');
    }
    return { data: context.data[id], get: () => context.get(id) };
  };

  return {
    CacheProvider,
    useCache,
  };
}

const {
  CacheProvider: ProjectCacheProvider,
  useCache: useProjectCache,
} = createCache({
  load: (id: string) => (
    internalApiService.adminGetProjectById(id)
      .then(({ data }) => data.project)
  ),
});

const {
  CacheProvider: UserCacheProvider,
  useCache: useUserCache,
} = createCache({
  load: (id: AdminUser['id']) => (
    internalApiService.adminGetUserById(id)
      .then(({ data }) => data.user)
  ),
});

const {
  CacheProvider: SafekeeperCacheProvider,
  useCache: useSafekeeperCache,
} = createCache({
  load: (id: AdminSafekeeper['id']) => (
    internalApiService.adminGetSafekeeperById(id)
      .then(({ data }) => data.safekeeper)
  ),
});

const {
  CacheProvider: PageserverCacheProvider,
  useCache: usePageserverCache,
} = createCache({
  load: (id: AdminPageserver['id']) => (
    internalApiService.adminGetPageserverById(id)
      .then(({ data }) => data.pageserver)
  ),
});

export {
  ProjectCacheProvider, useProjectCache,
  UserCacheProvider, useUserCache,
  SafekeeperCacheProvider, useSafekeeperCache,
  PageserverCacheProvider, usePageserverCache,
};
