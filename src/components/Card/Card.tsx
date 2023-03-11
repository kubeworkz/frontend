import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { Appearance, AsProps, ReplaceProps } from '../../types/Props';

import styles from './Card.module.css';

export interface CardProps extends
  AsProps,
  HTMLAttributes<HTMLElement> {
  overlay?: React.ReactNode;
  active?: boolean;
  appearance?: Appearance;
  action?: React.ReactNode;
  innerClassName?: string;
}

export function Card<As extends React.ElementType>({
  as: Component = 'div', overlay, active, children, appearance = 'primary', action, innerClassName, ...props
}: ReplaceProps<As, PropsWithChildren<CardProps>>) {
  return (
    <Component
      {...props}
      className={classNames(props.className, styles.card, styles[`${appearance}`], {
        [`${styles.overlaid}`]: !!overlay,
        [`${styles.active}`]: active,
      })}
    >
      <div
        className={classNames(styles.inner, innerClassName, {
          [`${styles.with_action}`]: !!action,
        })}
      >
        {children}
      </div>
      {action
        && (
        <div className={styles.action}>
          {action}
        </div>
        ) }
    </Component>
  );
}
