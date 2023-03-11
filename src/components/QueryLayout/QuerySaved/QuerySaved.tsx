import classNames from 'classnames';
import React, { Ref, useCallback, useState } from 'react';

import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { SvgIcon } from '../../../components/SvgIcon/SvgIcon';

import { SavedQuery } from '../../../api/publicv2';
import { ActionsDropdown } from '../../../components/ActionsDropdown/ActionsDropdown';
import { ActionsDropdownItem } from '../../../components/ActionsDropdown/ActionDropdownItem/ActionsDropdownItem';
import { apiErrorToaster } from '../../../api/utils';
import { EmptySidebarLayout } from '../EmptySidebarLayout/EmptySidebarLayout';
import { useQueryContext } from '../../../app/pages/Query/queryContext';
import { QuerySaveDialog } from '../QuerySaveButton/QuerySaveDialog';
import styles from './QuerySaved.module.css';

export const QueriesSaved = React.memo(() => {
  const {
    state: { queriesSaved, selectedQueryName },
    actions: { selectQuery, deleteSavedQuery, renameQuery },
  } = useQueryContext();
  const { trackUiInteraction } = useAnalytics();

  const onDelete = React.useCallback(
    (id: number) => {
      deleteSavedQuery(id);
      trackUiInteraction(AnalyticsAction.PlaygroundSavedDelete);
    },
    [deleteSavedQuery, trackUiInteraction],
  );

  const [renamingQuery, setRenamingQuery] = useState<SavedQuery>();

  const onRenameToggle = useCallback((v: SavedQuery) => {
    setRenamingQuery(v);
  }, []);

  const onSaveQueryName = useCallback(
    (name: string) => renameQuery(renamingQuery?.id ?? 0, name)
      .then(() => setRenamingQuery(undefined))
      .catch(apiErrorToaster),
    [renameQuery, renamingQuery],
  );

  return (
    <div className={styles.root}>
      <QuerySaveDialog
        key={renamingQuery?.id}
        isOpen={Boolean(renamingQuery)}
        onClose={() => setRenamingQuery(undefined)}
        onSaveQuery={onSaveQueryName}
        proposedName={renamingQuery?.name ?? ''}
      />
      {queriesSaved?.length === 0 ? (
        <EmptySidebarLayout
          icon={<SvgIcon name="empty_saved_53" />}
          message="You have no saved queries now"
        />
      ) : (
        queriesSaved?.map((item) => (
          <div
            role="button"
            onKeyPress={(event) => {
              if (event.key === 'Enter') selectQuery(item.name ?? '');
            }}
            tabIndex={0}
            className={classNames({
              [styles.item]: true,
              [styles.active]: item.name === selectedQueryName,
            })}
            onClick={() => {
              selectQuery(item.name ?? '');
            }}
            key={item.id}
          >
            <span className={styles.itemName} title={item.name}>
              {item.name}
            </span>
            <span className={styles.itemActions}>
              <ActionsDropdown
                triggerElement={({ onClick, ref }) => (
                  <SvgIcon
                    ref={ref as Ref<HTMLDivElement>}
                    onClick={onClick}
                    name="actions_16"
                  />
                )}
              >
                <ActionsDropdownItem
                  as="button"
                  onClick={() => onRenameToggle(item)}
                >
                  Rename
                </ActionsDropdownItem>
                <ActionsDropdownItem
                  as="button"
                  className={styles.delete}
                  onClick={() => onDelete(item.id ?? 0)}
                >
                  Delete
                </ActionsDropdownItem>
              </ActionsDropdown>
            </span>
          </div>
        ))
      )}
    </div>
  );
});

QueriesSaved.displayName = 'QueriesSaved';
