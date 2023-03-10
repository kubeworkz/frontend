import React from 'react';
import classNames from 'classnames';
import { Text } from '../../Text/Text';

import styles from './DataTableHeader.module.css';

interface DataTableHeaderProps {
  label?: React.ReactNode;
  total?: React.ReactNode;
  rightColNode?: React.ReactNode;
}

export const DataTableHeader = ({
  label,
  total,
  rightColNode,
}: DataTableHeaderProps) => (
  <div className={styles.root}>
    <div className={styles.left}>
      <h2
        className={classNames(styles.inlineText, styles.header)}
      >
        {label}
      </h2>
      {!!total && (
        <Text
          appearance="secondary"
          bold
          className={styles.inlineText}
        >
          {' '}
          (
          {total}
          )
        </Text>
      )}
    </div>
    <div className={styles.right}>
      {rightColNode}
    </div>
  </div>
);
