import classNames from 'classnames';
import React, {
  HTMLAttributes, ReactNode, useCallback, useState,
} from 'react';

import { Collapsible } from '../Collapsible/Collapsible';
import { SvgIcon } from '../SvgIcon/SvgIcon';

import styles from './Section.module.css';

export type SectionProps = {
  collapsible?: boolean;
  children: ReactNode;
  header: ReactNode;
} & HTMLAttributes<HTMLElement>;

export const Section = ({
  collapsible, children, header, ...rest
}: SectionProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className={styles.root} {...rest}>
      <div className={styles.header}>
        {header}
        {collapsible && (
        <SvgIcon
          name="chevron-down_16"
          onClick={useCallback(() => setCollapsed((s) => !s), [])}
          className={classNames(styles.icon_collapsible, { [styles.icon_collapsed]: collapsed })}
        />
        )}
      </div>
      <div className={styles.body}>
        <Collapsible collapsed={collapsed}>{children}</Collapsible>
      </div>
    </section>
  );
};
