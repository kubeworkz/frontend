import classNames from 'classnames';
import React from 'react';
import { generatePath, Link } from 'react-router-dom';

import { StatusButton } from '#shared/components/Button/StatusButton/StatusButton';
import { Button } from '#shared/components/Button/Button';
import { Loader } from '#shared/components/Loader/Loader';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { StatementResult } from '#api_client/publicv2';

import { ConsoleRoutes } from '#shared/routes';
import { humanizeNanoseconds } from '#shared/utils/units';
import { useQueryResultContext } from '../../QueryResult/queryResultContext';
import { useQueryContext } from '../../../pages/Query/queryContext';
import { useProjectsItemContext } from '../../../hooks/projectsItem';
import styles from './QueryLayoutActions.module.css';

export const QueryLayoutActions = () => {
  const { projectId } = useProjectsItemContext();
  const {
    state: {
      isQueryRunning, queryOptions, isDisabled, result, branchHasEndpoints, branch,
    }, actions,
  } = useQueryContext();
  const { currentIndex } = useQueryResultContext();
  const { trackUiInteraction } = useAnalytics();

  const durationNode: string = React.useMemo(() => {
    if (!result?.duration) {
      return '';
    }

    return humanizeNanoseconds(result.duration);
  }, [result]);

  const rowsNode = React.useMemo(() => {
    if (!result || !result.response || !Array.isArray(result.response)) {
      return '';
    }
    const visibleResult: StatementResult = result.response[currentIndex];
    if (!visibleResult || !visibleResult.data || !visibleResult.data.rows) {
      return '';
    }
    const count = visibleResult.data.rows.length;

    if (!count) {
      return '';
    }

    return `${count} row${count > 1 ? 's' : ''}`;
  }, [result, currentIndex]);

  const onRun = React.useCallback(() => {
    actions.run();
    trackUiInteraction(AnalyticsAction.PlaygroundRun);
  }, [actions, trackUiInteraction]);

  const onExplain = React.useCallback(() => {
    actions.run({ explain: true });
    trackUiInteraction(AnalyticsAction.PlaygroundExplain);
  }, [actions, trackUiInteraction]);

  const onAnalyze = React.useCallback(() => {
    actions.run({ explain: true, analyze: true });
    trackUiInteraction(AnalyticsAction.PlaygroundAnalyze);
  }, [actions, trackUiInteraction]);

  const actionsPlaceholder = React.useMemo(() => {
    if (branch && branchHasEndpoints) {
      return null;
    }

    if (!branch) {
      return (
        <>
          Please select a branch first.
        </>
      );
    }

    return (
      <>
        The selected branch does not have a compute endpoint.
        {' '}
        <Button
          as={Link}
          appearance="default"
          to={generatePath(ConsoleRoutes.ProjectsItemEndpoints, {
            projectId,
          })}
        >
          Manage compute endpoints.
        </Button>
      </>
    );
  }, [branch, branchHasEndpoints, projectId]);

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        {
          branchHasEndpoints
            ? (
              <>
                <div className={styles.run_action}>
                  <Button
                    disabled={isDisabled}
                    onClick={actions.cancel}
                    appearance="error"
                    className={classNames(styles.btn_cancel, {
                      [styles.btn_hidden]: !isQueryRunning,
                    })}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isDisabled || isQueryRunning}
                    icon="play_16"
                    onClick={onRun}
                    className={classNames(styles.btn_run, { [styles.btn_hidden]: isQueryRunning })}
                  >
                    Run
                  </Button>
                </div>
                <div className={styles.divider} />
                <StatusButton
                  disabled={isDisabled || isQueryRunning}
                  onClick={onExplain}
                  loading={isQueryRunning && queryOptions.explain && !queryOptions.analyze}
                  appearance="default"
                  className={styles.btn}
                  label={['Explain', '', '']}
                />
                <StatusButton
                  disabled={isDisabled || isQueryRunning}
                  onClick={onAnalyze}
                  loading={isQueryRunning && queryOptions.analyze}
                  appearance="default"
                  className={styles.btn}
                  label={['Analyze', '', '']}
                />
              </>
            )
            : (
              <div className={styles.info_item}>
                {actionsPlaceholder}
              </div>
            )
        }
      </div>
      <div className={styles.info}>
        {isQueryRunning
          ? <Loader />
          : (
            <>
              {durationNode && (
                <div className={styles.info_item}>
                  {durationNode}
                </div>
              )}
              {rowsNode && (
                <div className={styles.info_item}>
                  {rowsNode}
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};
