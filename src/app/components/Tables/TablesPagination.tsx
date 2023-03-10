import React from 'react';

import { Pagination } from '#shared/components/Pagination/Pagination';
import { useTables } from '../../pages/Tables/tablesContext';

export const TablesPagination = () => {
  const {
    offset, total, limit, onSetOffset,
  } = useTables();

  return (
    <Pagination
      total={total}
      limit={limit}
      offset={offset}
      onChangeOffset={onSetOffset}
    />
  );
};
