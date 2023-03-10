import React from 'react';

import { useTables } from '../../pages/Tables/tablesContext';
import styles from './Tables.module.css';

export const TablesTitleBar = () => {
  const { selectedTable } = useTables();
  return (
    <div className={styles.tablesTitleBar}>
      <div>{selectedTable}</div>
    </div>
  );
};
