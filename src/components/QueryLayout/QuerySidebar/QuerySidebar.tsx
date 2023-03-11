import React, { useCallback, useState } from 'react';

import { Toggle } from '../../../components/Toggle/Toggle';
import { ToggleButton } from '../../../components/Toggle/ToggleButton/ToggleButton';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { Button } from '../../../components/Button/Button';
import { QueryHistory } from '../QueryHistory/QueryHistory';
import { QueriesSaved } from '../QuerySaved/QuerySaved';
import { useQueryContext } from '../../../app/pages/Query/queryContext';
import styles from './QuerySidebar.module.css';

type Tab = 'saved' | 'history';

const initialTab = () => {
  const url = new URL(window.location.href);
  return url.searchParams.get('query') ? 'saved' : 'history';
};

export const QuerySidebar = React.memo(() => {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { trackUiInteraction } = useAnalytics();
  const { actions: { onChangeQuery, selectQuery } } = useQueryContext();

  const onNewQuery = useCallback(() => {
    onChangeQuery('');
    selectQuery(null);
  }, [onChangeQuery, selectQuery]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Toggle>
          <ToggleButton
            active={tab === 'saved'}
            onClick={() => {
              setTab('saved');
              trackUiInteraction(AnalyticsAction.PlaygroundTabSaved);
            }}
          >
            Saved
          </ToggleButton>
          <ToggleButton
            active={tab === 'history'}
            onClick={() => {
              setTab('history');
              trackUiInteraction(AnalyticsAction.PlaygroundTabHistory);
            }}
          >
            History
          </ToggleButton>
        </Toggle>
      </div>
      <div className={styles.body}>
        {tab === 'saved' && <QueriesSaved />}
        {tab === 'history' && <QueryHistory />}
      </div>
      <div className={styles.newQuery}>
        <Button wide appearance="secondary" icon="add_14" onClick={onNewQuery}>
          New Query
        </Button>
      </div>
    </div>
  );
});

QuerySidebar.displayName = 'QuerySidebar';
