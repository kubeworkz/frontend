import React from 'react';
import * as Sentry from '@sentry/react';

import { SvgIcon } from '../../components/SvgIcon/SvgIcon';
import { CopyButton } from '../../components/CopyButton/CopyButton';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';

import { useAppContext } from '../../app/hooks/app';
import styles from './PsqlConnectBanner.module.css';

export const PsqlConnectBanner = () => {
  const { trackUiInteraction } = useAnalytics();
  const { psqlConnectHost } = useAppContext();

  const command = `psql -h ${psqlConnectHost}`;

  if (!psqlConnectHost) {
    Sentry.captureMessage('Psql connect host hasn\'t set');
    return null;
  }

  return (
    <div className={styles.root}>
      <SvgIcon className={styles.icon} name="info_20" />
      Passwordless connect with psql:
      <div
        className={styles.codeBlock}
      >
        <span className={styles.command}>
          <span className={styles.codePrefix}>
            $
          </span>
          {command}
        </span>
        <CopyButton
          text={command}
          onCopy={() => trackUiInteraction(AnalyticsAction.PsqlConnectBannerCommandCopied)}
        />
      </div>
    </div>
  );
};
