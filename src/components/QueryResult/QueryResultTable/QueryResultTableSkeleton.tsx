import React from 'react';
import { Skeleton } from '#shared/components/Skeleton/Skeleton';
import { QueryResultTable } from './QueryResultTable';

const COLS_COUNT = 5;
const ROWS_WIDTHS = [
  110,
  110,
  150,
  110,
  90,
  110,
  150,
  110,
  90,
  110,
  150,
  110,
  90,
  110,
  150,
];

const QueryResultTableSkeletonView = () => {
  const [fields, ...rows] = React.useMemo(() => (
    ROWS_WIDTHS.map((w) => (
      Array.from(Array(COLS_COUNT))
        .map(() => <Skeleton style={{ width: `${w}px`, height: '12px', borderRadius: '6px' }} />)
    ))
  ), []);

  return (
    <QueryResultTable
      data={{
        fields, rows, truncated: false,
      }}
      scrollIsDisabled
    />
  );
};

export const QueryResultTableSkeleton = React.memo(QueryResultTableSkeletonView);
