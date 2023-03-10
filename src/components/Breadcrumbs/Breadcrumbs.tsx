import React, { createContext, useContext } from 'react';
import classNames from 'classnames';
import { generatePath, NavLink, withRouter } from 'react-router-dom';

import styles from './Breadcrumbs.module.css';

export interface BreadcrumbsConfig {
  path: string,
  label: React.ReactNode,
}

interface BreadcrumbsContextState {
  data: Record<string, BreadcrumbsConfig[]>;
}

export const BreadcrumbsContext = createContext<BreadcrumbsContextState>({
  data: {},
});

interface BreadcrumbsProps {
  data: BreadcrumbsConfig[];
  className?: string;
}

interface BreadcrumbsItemProps {
  item: BreadcrumbsConfig;
  isLast?: boolean;
}

export const BreadcrumbsItem = React.memo(
  ({ item, isLast = false }: BreadcrumbsItemProps) => (!isLast
    ? (
      <NavLink
        className={classNames(styles.item, styles.item_link)}
        to={item.path}
      >
        {item.label}
      </NavLink>
    )
    : <span className={styles.item}>{item.label}</span>),
);
BreadcrumbsItem.displayName = 'BreadcrumbsItem';

export const BreadcrumbsDivider = React.memo(() => (
  <span className={styles.divider}>/</span>
));
BreadcrumbsDivider.displayName = 'BreadcrumbsDivider';

export const Breadcrumbs = React.memo(({ data, className }: BreadcrumbsProps) => (
  <div className={classNames(styles.root, className)}>
    {data.map((item, index) => (
      <React.Fragment key={item.path}>
        <BreadcrumbsItem item={item} isLast={index === data.length - 1} />
        {index < data.length - 1 && <BreadcrumbsDivider />}
      </React.Fragment>
    ))}
  </div>
));

Breadcrumbs.displayName = 'Breadcrumbs';

export const BreadcrumbsContainer = withRouter(({ match }) => {
  const { data } = useContext(BreadcrumbsContext);
  const { path, params } = match;

  const config = data[path];

  if (!config || !config.length) {
    return null;
  }

  return (
    <Breadcrumbs
      data={config.map((item) => ({
        ...item,
        path: generatePath(item.path, params),
      }))}
    />
  );
});

BreadcrumbsContainer.displayName = 'BreadcrumbsContainer';
