import { times } from 'lodash';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import { QueryHistoryItem } from '../../../api/publicv2';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';

import { SvgIcon } from '../../../components/SvgIcon/SvgIcon';
import { useQueryContext } from '../../../app/pages/Query/queryContext';
import { EmptySidebarLayout } from '../EmptySidebarLayout/EmptySidebarLayout';
import styles from './QueryHistory.module.css';

const QueryHistoryLoaded = () => {
  const {
    state: { queriesHistory },
    actions: { onChangeQuery, selectQuery },
  } = useQueryContext();
  const { trackUiInteraction } = useAnalytics();

  const [selected, setSelected] = useState<number | null>(null);
  const onRecordSelect = useCallback(async (record: QueryHistoryItem) => {
    if (await selectQuery(null)) {
      setSelected(record.id ?? 0);
      onChangeQuery(record.query ?? '');
    }
  }, [onChangeQuery]);

  return (
    <>
      {queriesHistory?.length === 0 ? (
        <EmptySidebarLayout
          icon={<SvgIcon name="empty_history_48" />}
          message="Your history is empty"
        />
      )
        : queriesHistory?.map((record) => (
          <div
            role="button"
            tabIndex={0}
            className={classNames(styles.historyRecord, {
              [styles.selected]: record.id === selected,
            })}
            onClick={() => {
              onRecordSelect(record);
              trackUiInteraction(AnalyticsAction.PlaygroundHistorySelect);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onRecordSelect(record);
                trackUiInteraction(AnalyticsAction.PlaygroundHistorySelect, {
                  keyboard: true,
                });
              }
            }}
            key={record.id}
          >
            <div className={styles.recordName}>{record.query}</div>
            <div className={styles.recordTime}>
              {moment(record.created_at).format('MMM D, YYYY - h:mma')}
            </div>
          </div>
        ))}
    </>
  );
};

const QueryHistoryComponent = React.memo(() => {
  const {
    state: { queriesHistory },
  } = useQueryContext();

  return (
    <div className={styles.history}>
      {queriesHistory
        ? <QueryHistoryLoaded />
        : times(3, (idx) => (
          <div role="button" key={idx} className={styles.historyRecord}>
            <Skeleton style={{ width: 200, height: 20 }} />
            <div style={{ height: 10 }} />
            <Skeleton style={{ width: 100, height: 20 }} />
          </div>
        ))}
    </div>
  );
});

QueryHistoryComponent.displayName = 'QueryHistory';

export { QueryHistoryComponent as QueryHistory };
