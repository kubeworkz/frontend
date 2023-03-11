import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import { AnyLinkConfig } from '../../components/AnyLink/AnyLink';
import { WidgetLink } from '../../components/Widget/WidgetLink';
import styles from './Widget.module.css';

export interface WidgetProps {
  title?: React.ReactNode;
  links?: Array<AnyLinkConfig | React.ReactNode>;
  children: React.ReactNode;
}

export const Widget = ({
  title,
  links,
  children,
  className,
}: PropsWithChildren<WidgetProps & Omit<HTMLAttributes<HTMLDivElement>, 'title'>>) => (
  <div className={classNames(styles.container, className)}>
    <div className={styles.header}>
      {title && <div className={styles.title}>{title}</div>}
      {links
          && (
          <div className={styles.links}>
            {links.map((link, i) => {
              if (React.isValidElement(link)) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={i}>
                    {link}
                  </React.Fragment>
                );
              }
              return (
                <WidgetLink
                  key={`${(link as AnyLinkConfig).as}_${(link as AnyLinkConfig).children}`}
                  {...link}
                />
              );
            })}
          </div>
          )}
    </div>
    {children}
  </div>
);
