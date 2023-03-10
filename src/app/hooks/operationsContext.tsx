import React, {
  createContext, PropsWithChildren, useState,
} from 'react';
import { createUseContext } from '../../hooks/utils';
import {
  getNewestData,
  useSubscription, UseSubscriptionReturns,
} from '../../hooks/actionCable';
import { Operation, apiService } from '../../api/publicv2';
import { createErrorText, debounceApiRequest } from '../../api/utils';

interface OperationsContextInterface extends UseSubscriptionReturns{
  state: {
    operations?: Operation[],
    operationsById: Record<string, Operation>
    isLoading: boolean,
    error?: string;
  };
  get(): Promise<void>;
}

const OperationsContext = createContext<OperationsContextInterface | null>(null);

const useOperationsContext = createUseContext(OperationsContext);

const OperationsProvider = (
  {
    projectId,
    children,
  }: PropsWithChildren<{ projectId: string }>,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [operationIds, setOperationIds] = useState<Operation['id'][] | null>(null);
  const [operationsById, setOperationsById] = useState<Record<string, Operation>>({});

  const get = React.useCallback(debounceApiRequest(
    () => apiService.listProjectOperations({ projectId })
      .then(({ data }) => {
        if (data.operations && Array.isArray(data.operations)) {
          setOperationIds(data.operations.map(({ id }) => id));
          setOperationsById((ops) => (
            data.operations
              .reduce((acc, op) => ({ ...acc, [op.id]: getNewestData(op, ops[op.id]) }), {})
          ));
        }
      }).catch((err) => {
        setError(createErrorText(err));
      }).finally(() => {
        setIsLoading(false);
      }),
  ),
  [projectId]);

  const { subscribe, unsubscribe } = useSubscription('/operations', (op) => {
    setOperationsById((ops) => ({
      ...ops,
      [op.id]: getNewestData(ops[op.id], op),
    }));

    if (!operationIds || !operationIds.includes(op.id)) {
      get();
    }
  }, get);

  React.useEffect(() => {
    get();
    subscribe();

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  return (
    <OperationsContext.Provider value={{
      state: {
        operations: (operationIds || []).map((id) => operationsById[id]).filter(Boolean),
        operationsById,
        isLoading: isLoading && !operationIds,
        error,
      },
      get,
      subscribe,
      unsubscribe,
    }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export { OperationsProvider, useOperationsContext };
