import React from 'react';
import classNames from 'classnames';

import { Result } from '../../app/pages/Query/queryContext';
import styles from './QueryResult.module.css';
import { QueryResultTabs } from './QueryResultTabs/QueryResultTabs';
import { QueryResultTableSkeleton } from './QueryResultTable/QueryResultTableSkeleton';

export type QueryResultProps = {
  result: Result | undefined;
  isQueryRunning: boolean;
  offset?: number;
};
export const QueryResult = ({ result, isQueryRunning, offset }: QueryResultProps) => {
  if (isQueryRunning) {
    return (
      <div className={classNames(styles.root, styles.root_skeleton)}>
        <QueryResultTableSkeleton />
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div data-qa="query_result" className={styles.root}>
      <QueryResultTabs
        data={result.response}
        offset={offset}
      />
    </div>
  );
};
