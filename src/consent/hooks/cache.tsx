import { Project } from '../../api/publicv2';
import { createCacheContext } from '../../hooks/cache';

type AppCache = { project?: Project };

const appCache = createCacheContext<AppCache>({});
export const useAppCache = appCache.useCache;
export const AppCacheProvider = appCache.Provider;
