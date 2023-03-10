import React, { createContext, ReactNode } from 'react';

import { createUseContext } from '#shared/hooks/utils';

export type QueryResultContextType = {
  currentIndex: number;

  onCurrentIndexChange: (index: number) => void;
};

const QueryResultContext = createContext<QueryResultContextType | null>(null);

export const useQueryResultContext = createUseContext(QueryResultContext);

export const QueryResultProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <QueryResultContext.Provider value={{
      currentIndex,
      onCurrentIndexChange: setCurrentIndex,
    }}
    >
      {children}
    </QueryResultContext.Provider>
  );
};
