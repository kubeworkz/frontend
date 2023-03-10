import React, {
  createContext, useCallback, useContext, useMemo, useRef,
} from 'react';

export function createCacheContext<T>(initialValue: T) {
  const context = createContext<{
    getAppCache:() => T;
    setAppCache: (value: T) => void;
  }>({
        getAppCache: () => initialValue,
        setAppCache: () => {},
      });
  context.displayName = 'CacheContext';
  const ContextProvider = context.Provider;

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const appCache = useRef(initialValue);
    const getAppCache = useCallback(() => appCache.current, []);
    const setAppCache = useCallback((state: T) => {
      appCache.current = state;
    }, []);

    const ctxValue = useMemo(() => ({
      getAppCache,
      setAppCache,
    }), [getAppCache, setAppCache]);

    return (
      <ContextProvider value={ctxValue}>
        {children}
      </ContextProvider>
    );
  };

  const useCache = () => useContext(context);

  return {
    Provider,
    useCache,
  };
}
