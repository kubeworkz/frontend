import classNames from 'classnames';
import React from 'react';

import styles from './Info.module.css';

export type InfoProps = React.HTMLAttributes<HTMLDivElement>;
export const Info = ({ className, children, ...rest }: InfoProps) => (
  <div {...rest} className={classNames(styles.root, className)}>
    {children}
  </div>
);
