/* eslint-disable react/no-array-index-key */

import React, { useEffect } from 'react';
import { QueryResponse as QueryResult } from '../../../api/publicv2';
import { Tabs } from '../../../components/Tabs/Tabs';
import { QueryResultExplain } from '../QueryResultExplain/QueryResultExplain';
import { QueryResultTable } from '../QueryResultTable/QueryResultTable';

import { useQueryResultContext } from '../queryResultContext';
import styles from './QueryResultTabs.module.css';

interface QueryResultTabsProps {
  data: QueryResult['response'];
  offset?: number;
}

export const QueryResultTabs = ({ data, offset }: QueryResultTabsProps) => {
  const { currentIndex, onCurrentIndexChange } = useQueryResultContext();

  useEffect(() => onCurrentIndexChange(0), [data]);

  const tabsOptions = React.useMemo(() => data?.map((item, index) => ({
    value: index,
    label: item.query,
  })), [data]);

  if (!data || !data.length || !data[currentIndex]) {
    return null;
  }

  const currentData = data[currentIndex];

  let queryResult: React.ReactNode = (
    <pre className={styles.error}>
      Something went wrong
    </pre>
  );

  if (currentData.error) {
    queryResult = (
      <pre className={styles.error}>
        {currentData.error}
      </pre>
    );
  } else if (currentData.explain_data?.length) {
    queryResult = (
      <QueryResultExplain
        query={currentData.query}
        plan={currentData.explain_data.map((i) => i['QUERY PLAN']).join('\n')}
      />
    );
  } else if (currentData.data) {
    queryResult = (
      <QueryResultTable
        offset={offset}
        data={currentData.data}
      />
    );
  }

  return (
    <div className={styles.root}>
      {data.length > 1
        && (
          <Tabs
            className={styles.list}
            options={tabsOptions}
            value={currentIndex}
            onChange={onCurrentIndexChange}
          />
        )}
      <div className={styles.body}>
        {queryResult}
      </div>
    </div>
  );
};
