import React from 'react';
import classNames from 'classnames';

import styles from './ContainerWithNav.module.css';

interface ContainerWithNavProps {
  contentWidth: 's' | 'm' | 'l',
  children: [React.ReactNode, React.ReactNode];
}

export const ContainerWithNav = ({ contentWidth, children }: ContainerWithNavProps) => (
  <div className={classNames(styles.root, styles[`root_${contentWidth}`])}>
    <div className={styles.left}>
      {children[0]}
    </div>
    <div className={classNames(styles.middle, styles[`middle_${contentWidth}`])}>
      <div className={classNames(styles.container, styles[`container_${contentWidth}`])}>
        {children[1]}
      </div>
    </div>
    <div className={styles.compensator} />
  </div>
);
