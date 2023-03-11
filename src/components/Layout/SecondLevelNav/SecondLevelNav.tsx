import React from 'react';

import { AnyLink, AnyLinkConfig } from '../../../components/AnyLink/AnyLink';
import styles from './SecondLevelNav.module.css';

interface SecondLevelNavProps {
  config: AnyLinkConfig[];
}

export const SecondLevelNav = ({ config }: SecondLevelNavProps) => (
  <ul className={styles.nav}>
    {config.map((item) => (
      <li key={item.id} className={styles.item}>
        <AnyLink
          {...item}
          data-qa="side_nav_item"
          data-qa-id={item.id}
          className={styles.link}
          activeClassName={styles.link_active}
        />
      </li>
    ))}
  </ul>
);
