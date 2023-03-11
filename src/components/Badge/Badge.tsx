import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { AppearanceStatus, SizeProps } from '../../types/Props';

import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, SizeProps {
  appearance?: AppearanceStatus | 'cloudrock' | 'primary';
  noMargins?: boolean;
}

export const Badge = ({
  appearance = 'success', children, size = 's', noMargins, ...props
}: PropsWithChildren<BadgeProps>) => (
  <div
    {...props}
    className={classNames(props.className, styles.root, styles[appearance], styles[size], {
      [styles.noMargins]: noMargins,
    })}
  >
    {children}
  </div>
);

export const ComingSoonBadge = () => (
  <Badge
    appearance="default"
  >
    Coming soon
  </Badge>
);

export const BetaBadge = ({ className, ...props }: BadgeProps) => (
  <Badge
    {...props}
    appearance="default"
    className={classNames(className, styles.beta)}
  >
    β
  </Badge>
);
