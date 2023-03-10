import { Project } from '#api_client/publicv2';
import { createCacheContext } from '#shared/hooks/cache';

type AppCache = { project?: Project };

const appCache = createCacheContext<AppCache>({});
export const useAppCache = appCache.useCache;
export const AppCacheProvider = appCache.Provider;
