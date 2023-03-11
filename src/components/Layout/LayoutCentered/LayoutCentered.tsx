import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { ErrorBoundary } from '@sentry/react';

import { PageError } from '../../../components/PageError/PageError';
import { AnyLink } from '../../../components/AnyLink/AnyLink';
import { LimitedPreviewBanner } from '../../../components/Layout/LimitedPreviewBanner/LimitedPreviewBanner';
import logo from '../../../assets/images/logo_sidemenu.svg';

import { User } from '../../../components/Layout/User/User';
import {
  MenuItemDocumentation,
  MenuItemFeedback,
  MenuItemSupport,
} from '../../../components/Layout/MenuItem/MenuItemPresets';
import { LayoutBasicProps } from '../../../components/Layout/types';
import styles from './LayoutCentered.module.css';

export interface LayoutCenteredProps extends LayoutBasicProps {
}

const LayoutCenteredC = ({
  children,
  showLimitedPreviewBanner = true,
  hideUser,
  userMenuConfig,
  disableSignOut,
  logoLinkConfig = { to: '/' },
  showHelp = true,
}: PropsWithChildren<LayoutCenteredProps>) => (
  <div className={styles.root}>
    {
        showLimitedPreviewBanner
        && <LimitedPreviewBanner />
      }
    <div className={classNames(styles.header)}>
      <AnyLink {...logoLinkConfig} className={styles.headerLogo}>
        <img src={logo} alt="Neon logo" width={92} height={26} />
      </AnyLink>
    </div>
    <div className={styles.main}>
      <ErrorBoundary fallback={() => <PageError />}>
        <div className={styles.container}>
          {children}
        </div>
      </ErrorBoundary>
    </div>
    <div className={styles.footer}>
      {!hideUser && (
      <User
        userMenuConfig={userMenuConfig}
        disableSignOut={disableSignOut}
      />
      )}
      {showHelp
          && (
          <>
            {!hideUser && <div className={styles.divider} />}
            <MenuItemDocumentation />
            <MenuItemSupport />
            <MenuItemFeedback />
          </>
          )}
    </div>
  </div>
);

export const LayoutCentered = React.memo(LayoutCenteredC);

LayoutCentered.displayName = 'LayoutNextCentered';
