import * as React from 'react';

export function createUseContext<T>(Context: React.Context<T | null>): () => T {
  return () => {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error(`unknown context ${Context.displayName}`);
    }

    return context;
  };
}
