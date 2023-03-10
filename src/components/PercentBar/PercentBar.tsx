import React, { ForwardedRef, HTMLAttributes } from 'react';
import { AppearanceProps } from '#shared/types/Props';

import classNames from 'classnames';
import { WithTooltip } from '#shared/components/WithTooltip/WithTooltip';
import styles from './PercentBar.module.css';

interface PercentBarProps extends AppearanceProps<'primary'> {
  percent: number; // 0 to 1
  hint?: React.ReactNode;
}

interface BarProps extends AppearanceProps<'primary'>, HTMLAttributes<HTMLDivElement> {
  width: string;
}

const Bar = React.forwardRef((
  { appearance, width, ...props }: BarProps,
  ref: ForwardedRef<HTMLDivElement>,
) => (
  <div className={styles.container} {...props} ref={ref}>
    <div className={classNames(styles.bar, styles[`${appearance}`])} style={{ width }} />
  </div>
));
Bar.displayName = 'Bar';

export const PercentBar = ({ percent, appearance = 'primary', hint }: PercentBarProps) => {
  const val = Math.floor(percent * 100);

  return (
    <div className={styles.root}>
      {hint ? (
        <WithTooltip
          tooltipInner={hint}
        >
          {(opts) => (
            <Bar width={`${val}%`} appearance={appearance} {...opts} />
          )}
        </WithTooltip>
      )
        : <Bar width={`${val}%`} appearance={appearance} />}
      <div className={styles.text}>
        {val}
        %
      </div>
    </div>
  );
};
