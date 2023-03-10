import {
  useCallback, useEffect, useRef, useState,
} from 'react';

export type UseRequestResult<T> = { reload: () => void } & (
  | { data: undefined; isLoading: true; error: undefined }
  | { data: T; isLoading: false; error: undefined }
  | { data: undefined; isLoading: false; error: Error }
);

export const useRequest = <T>(
  requestFn: () => Promise<T>,
  deps: unknown[] = [],
) => {
  const isMounted = useRef(true);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );
  const cancelCurrentRequest = useRef(() => {});
  const reload = useCallback(() => {
    cancelCurrentRequest.current();
    let cancelled = false;
    setLoading(true);
    requestFn()
      .then((result) => {
        if (isMounted.current && !cancelled) {
          setData(result);
        }
      })
      .catch((ex) => {
        if (isMounted.current && !cancelled) {
          setError(ex);
        }
      })
      .finally(() => {
        if (isMounted.current && !cancelled) {
          setLoading(false);
        }
      });
    cancelCurrentRequest.current = () => {
      cancelled = true;
    };
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    isLoading,
    data,
    error,
    reload,
  } as UseRequestResult<T>;
};
