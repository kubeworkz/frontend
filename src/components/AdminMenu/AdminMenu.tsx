import React, { useState } from 'react';

import Draggable from 'react-draggable';

import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { AnyLink } from '../../components/AnyLink/AnyLink';
import { ADMIN_BASE_ROUTE } from '../../routes/routes';
import styles from './AdminMenu.module.css';

type EnvOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

const UNKNOWN_ENV: EnvOption = {
  label: 'unknown',
  value: 'unknown',
  disabled: true,
};

const LOCAL_ENV: EnvOption = {
  label: 'local',
  value: 'localhost',
  disabled: true,
};

const ENV_OPTIONS: EnvOption[] = [
  {
    label: 'staging',
    value: 'console.stage.cloudrock.ca',
  },
  {
    label: 'production',
    value: 'console.cloudrock.ca',
  },
  {
    label: 'captest',
    value: 'console.dev.cloudrock.ca',
  },
];

export type AdminMenuProps = {
  appVersion: string;
};
export const AdminMenu = ({ appVersion }: AdminMenuProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const onChangeEnv = React.useCallback((o: EnvOption) => {
    const url = `https://${o.value}${window.location.pathname}${window.location.search}`;

    window.open(url);
  }, []);

  const currentEnvOption = React.useMemo(() => {
    const { hostname } = window.location;
    if (hostname === 'localhost') {
      return LOCAL_ENV;
    }

    return ENV_OPTIONS.find((o) => o.value === hostname) || UNKNOWN_ENV;
  }, []);
  const envOptions = (
    ENV_OPTIONS.includes(currentEnvOption)
      ? ENV_OPTIONS
      : [currentEnvOption, ...ENV_OPTIONS]
  );

  const onClickToggle = () => {
    setCollapsed((curr) => !curr);
  };

  return (
    <Draggable
      offsetParent={document.body}
      defaultPosition={{
        x: 5,
        y: 2,
      }}
      bounds="body"
      handle={`.${styles.header}`}
    >
      <div className={styles.root}>
        <div className={styles.header}>
          {!collapsed && 'Admin menu'}
          <AnyLink
            as="button"
            onClick={onClickToggle}
            className={styles.toggle_btn}
          >
            {collapsed ? 'Open admin menu' : 'collapse'}
          </AnyLink>
        </div>
        {!collapsed && (
        <div className={styles.body}>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.row}>
                <th>
                  App version:
                </th>
                <td>
                  {appVersion}
                </td>
              </tr>
              <tr className={styles.row}>
                <th>
                  Static version:
                </th>
                <td>
                  {process.env.SENTRY_RELEASE}
                </td>
              </tr>
              <tr className={styles.row}>
                <th>Environment:</th>
                <td>
                  <FormSelect
                    className={styles.env_select}
                    size="s"
                    options={envOptions}
                    value={currentEnvOption}
                    onChange={onChangeEnv}
                  />
                </td>
              </tr>
              <tr className={styles.row}>
                <th />
                <td>
                  <AnyLink
                    as="a"
                    href={`${window.location.origin}${ADMIN_BASE_ROUTE}`}
                    target="_blank"
                  >
                    Open admin page
                  </AnyLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
      </div>
    </Draggable>
  );
};
