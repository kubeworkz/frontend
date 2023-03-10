import React, { Suspense } from 'react';

import './QueryResultExplain.css';

interface QueryResultExplainProps {
  query: string;
  plan: string;
}

const Pev2React = React.lazy(() => import('#shared/components/Pev2react/index.light'));

export const QueryResultExplain = ({ query, plan }: QueryResultExplainProps) => (
  <Suspense fallback={<div className="QueryResultExplain">Loading...</div>}>
    <Pev2React
      className="QueryResultExplain"
      query={query}
      plan={plan}
    />
  </Suspense>
);
