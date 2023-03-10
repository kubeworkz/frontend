import React, { PropsWithChildren } from 'react';

import classNames from 'classnames';
import styles from './Settings.module.css';

export const SettingsPageHeader = ({ children }: PropsWithChildren<{}>) => (
  <h1 className={styles.page_header}>{children}</h1>
);

export const SettingsSection = ({ children }: PropsWithChildren<{}>) => (
  <div className={styles.section}>{children}</div>
);

export const SettingsDesc = ({ children }: PropsWithChildren<{}>) => (
  <div className={styles.desc}>{children}</div>
);

export const SettingsHeader = ({ children }: PropsWithChildren<{}>) => (
  <div className={styles.header}>{children}</div>
);

export const SettingsDivider = () => (
  <hr className={styles.divider} />
);

export const SettingsActions = ({ children }: PropsWithChildren<{}>) => (
  <div className={classNames(styles.desc, styles.actions)}>{children}</div>
);
