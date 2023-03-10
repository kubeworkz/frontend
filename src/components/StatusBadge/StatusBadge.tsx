import React, { HTMLAttributes } from 'react';

import { Appearance, AppearanceStatus } from '#shared/types/Props';
import { WithTooltip } from '#shared/components/WithTooltip/WithTooltip';
import classNames from 'classnames';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import styles from './StatusBadge.module.css';

export type StatusBadgeAppearance = AppearanceStatus | Appearance | 'highlight-secondary' | 'tertiary';

interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  appearance?: StatusBadgeAppearance;
  pending?: boolean;
  tooltip?: React.ReactNode;
  short?: boolean;
}

export const StatusBadge = ({
  label, appearance, pending, tooltip, short, className, ...props
}: StatusBadgeProps) => (
  <WithTooltip
    tooltipInner={tooltip}
  >
    {(opts) => (
      <div
        {...opts}
        style={{
          display: 'flex',
        }}
      >
        <div
          className={classNames(styles.root, className)}
          data-qa-status-pending={pending}
          data-qa-status-appearance={appearance}
          {...props}
        >
          <div
            className={classNames(styles.icon, {
              [styles.icon_pending]: pending,
            })}
          >
            {pending
              ? <SvgIcon name="pending_12" className={styles.pending} />
              : <div className={classNames(styles.dot, styles[`dot_${appearance}`])} />}
          </div>
          {!short && (
          <span className={styles.label}>
            {label}
          </span>
          )}
        </div>
      </div>
    )}
  </WithTooltip>
);
