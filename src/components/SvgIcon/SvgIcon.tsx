import React, {
  ForwardedRef, forwardRef, HTMLAttributes, Suspense,
} from 'react';
import classNames from 'classnames';
import { ErrorBoundary } from '#shared/components/ErrorBoundary/ErrorBoundary';

import styles from './SvgIcon.module.css';

export type IconName = (
  'clear-24'
  | 'help-24'
  | 'spinner-24'
  | 'check-24'
  | 'sort-24'
  | 'sort-asc-24'
  | 'sort-desc-24'
  // new ones
  | 'pending_12'
  | 'copy_20'
  | 'projects-nav-dashboard_20'
  | 'projects-nav-sql-editor_20'
  | 'projects-nav-settings_20'
  | 'arrow-left_12'
  | 'arrow-left_18'
  | 'trash-bin_20'
  | 'close_16'
  | 'close_20'
  | 'actions_16'
  | 'check_12'
  | 'chevron-down_16'
  | 'chevron-right_16'
  | 'eye_24'
  | 'eye-hide_24'
  | 'mark-github_34'
  | 'mark-google_34'
  | 'question-mark-28'
  | 'lifebuoy-28'
  | 'paper-28'
  | 'reset_24'
  | 'database_40'
  | 'person_40'
  | 'info_20'
  | 'play_16'
  | 'empty_saved_53'
  | 'empty_history_48'
  | 'hint-12'
  | 'hasura_84'
  | 'not-found_56'
  | 'database_20'
  | 'tree_20'
  | 'burger_28'
  | 'calendar_12'
  | 'database_12'
  | 'parent_12'
  | 'storage_12'
  | 'branching_14'
  | 'success_50'
  | 'id_12'
  | 'analyze_20'
  | 'analyze-run_20'
  | 'billing_20'
  | 'branch_20'
  | 'clear_20'
  | 'close-small_20'
  | 'connectwith_20'
  | 'docs_20'
  | 'download_20'
  | 'editor_20'
  | 'endpoint_20'
  | 'feedback_20'
  | 'graph_20'
  | 'help_20'
  | 'limit_20'
  | 'operations_20'
  | 'overview_20'
  | 'play_20'
  | 'pointer_20'
  | 'pooler_20'
  | 'project_20'
  | 'release_20'
  | 'roles_20'
  | 'save_20'
  | 'schema_20'
  | 'select_20'
  | 'settings_20'
  | 'socket_20'
  | 'storage_20'
  | 'table_20'
  | 'team_20'
  | 'trash_20'
  | 'user_20'
  | 'chat_20'
  | 'fail_50'
  | 'integrations_16'
  | 'cloudrock_20'
  | 'full-bill_20'
  | 'compute_20'
  | 'storage-disk_20'
  | 'written-data_20'
  | 'data-transfer_20'
);

interface SvgIconProps extends HTMLAttributes<HTMLDivElement>{
  name: IconName
  size?: number;
}

const SvgIconC = forwardRef((
  {
    name, size, ...props
  }: SvgIconProps, ref: ForwardedRef<HTMLDivElement>,
) => {
  const Icon = React.lazy(() => import(`#shared/assets/icons/${name}.svg`));

  const fallback = React.useMemo(() => {
    const chunks = name.split('_');
    const iconSize = `${size || chunks[1]}px`;
    return <div style={{ width: iconSize, height: iconSize }} />;
  }, [name]);

  return (
    <div
      {...props}
      className={classNames(props.className, styles.root, styles[`root--${name}`], {
        [styles.custom]: typeof size === 'number',
      })}
      ref={ref}
      style={size ? {
        width: `${size}px`,
        height: `${size}px`,
      } : {}}
    >
      <ErrorBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          {/* @ts-ignore */}
          <Icon />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
});
SvgIconC.displayName = 'SvgIconC';

export const SvgIcon = React.memo(SvgIconC);
