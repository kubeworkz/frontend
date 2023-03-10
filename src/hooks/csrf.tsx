import React, { createContext, PropsWithChildren } from 'react';
import { createUseContext } from './utils';

interface CSRFContextInterface {
  token: string;
}

export interface CSRFProps {
  token: string;
}

const CSRFContext = createContext<CSRFContextInterface | null>(null);

const useCSRFContext = createUseContext(CSRFContext);

const CSRFProvider = ({ children, token }: PropsWithChildren<CSRFProps>) => (
  <CSRFContext.Provider value={{
    token,
  }}
  >
    {children}
  </CSRFContext.Provider>
);

export { CSRFProvider, useCSRFContext };
