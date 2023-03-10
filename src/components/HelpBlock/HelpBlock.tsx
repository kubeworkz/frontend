import classNames from 'classnames';
import * as React from 'react';
import { SvgIcon } from '../SvgIcon/SvgIcon';

import styles from './HelpBlock.module.css';

export type HelpBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export const HelpBlock = ({ children, className }: HelpBlockProps) => (
  <div className={classNames(styles.root, className)}>
    <div className={styles.content}>
      <SvgIcon name="hint-12" className={styles.icon} />
      <div className={styles.text}>{children}</div>
    </div>
  </div>
);
