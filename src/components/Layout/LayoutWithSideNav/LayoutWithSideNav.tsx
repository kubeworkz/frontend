import React, { PropsWithChildren } from 'react';

import {
  LayoutBasicProps, LayoutContentWidthProps,
  LayoutNavProps,
  LayoutOnboardingProps, NavItemConfig,
} from '../../../components/Layout/types';
import logo from '../../../assets/images/logo_sidemenu.svg';
import { AnyLink } from '../../../components/AnyLink/AnyLink';
import { MenuItem } from '../../../components/Layout/MenuItem/MenuItem';
import classNames from 'classnames';
import { PageError } from '../../../components/PageError/PageError';
import { Onboarding } from '../../../components/Layout/Onboarding/Onboarding';
import { ContainerWithNav } from '../../../components/Layout/ContainerWithNav/ContainerWithNav';
import { SecondLevelNav } from '../../../components/Layout/SecondLevelNav/SecondLevelNav';
import { ErrorBoundary } from '@sentry/react';
import { isOnboardingDone } from '../../../utils/newProjectOnboarding';
import {
  MenuItemCommunity, MenuItemDocumentation, MenuItemFeedback, MenuItemReleaseNotes,
  MenuItemSupport,
} from '../../../components/Layout/MenuItem/MenuItemPresets';
import { User } from '../../../components/Layout/User/User';
import { MenuGroup } from '../../../components/Layout/MenuGroup/MenuGroup';
import { IconName, SvgIcon } from '../../../components/SvgIcon/SvgIcon';
import { LimitedPreviewBanner } from '../../../components/Layout/LimitedPreviewBanner/LimitedPreviewBanner';
import styles from './LayoutWithSideNav.module.css';

export interface LayoutWithSideNavProps extends
  LayoutBasicProps,
  LayoutNavProps,
  LayoutOnboardingProps,
  LayoutContentWidthProps {
  pageHeader?: React.ReactNode;
  pageIcon?: IconName;
}

export const LayoutWithSideNav = ({
  logoLinkConfig = { to: '/' },
  firstLevelNavConfig = [],
  quickNav,
  showOnboarding: initialShowOnboarding,
  onboardingContent,
  secondLevelNavConfig,
  contentWidth = 'm',
  userMenuConfig,
  hideUser,
  disableSignOut,
  pageHeader = '',
  pageIcon,
  showHelp,
  showLimitedPreviewBanner,
  children,
  footer,
  // ...props
}: PropsWithChildren<LayoutWithSideNavProps>) => {
  const [onboardingHidden, setOnboardingHidden] = React.useState(isOnboardingDone());

  const showOnboarding = React.useMemo(
    () => (initialShowOnboarding && !onboardingHidden),
    [initialShowOnboarding, onboardingHidden],
  );

  const topLevelNavConfig: NavItemConfig[][] = React.useMemo(() => {
    if (!firstLevelNavConfig || !firstLevelNavConfig.length) {
      return [];
    }

    return Array.isArray(firstLevelNavConfig[0])
      ? firstLevelNavConfig as NavItemConfig[][]
      : [firstLevelNavConfig as NavItemConfig[]];
  }, [firstLevelNavConfig]);

  return (
    <div className={styles.root}>
      {
        showLimitedPreviewBanner
          && <LimitedPreviewBanner />
      }
      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.menu}>
            <div className={styles.menuRow}>
              <AnyLink {...logoLinkConfig} className={styles.logo}>
                <img src={logo} alt="Cloudrock logo" width={83} height={23} />
              </AnyLink>
            </div>
            <div className={classNames(styles.menuRow, styles.menuRow_wide)}>
              {topLevelNavConfig.map((group) => (
                <MenuGroup
                  key={group.map((item) => (item.id)).join('_')}
                >
                  {
                    group.map((item) => (<MenuItem {...item} key={item.id} />))
                  }
                </MenuGroup>
              ))}
            </div>
            <div className={styles.menuRow}>
              {showHelp && (
                <MenuGroup>
                  <MenuItemCommunity />
                  <MenuItemFeedback />
                  <MenuItemDocumentation />
                  <MenuItemReleaseNotes />
                  <MenuItemSupport />
                </MenuGroup>
              )}
              {!hideUser && (
                <MenuGroup>
                  <User
                    className={styles.user}
                    userMenuConfig={userMenuConfig}
                    disableSignOut={disableSignOut}
                  />
                </MenuGroup>
              )}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <div className={styles.title}>
              {pageIcon && <SvgIcon name={pageIcon} />}
              {pageHeader}
            </div>
            <div>
              {quickNav}
            </div>
          </div>
          <div className={styles.scrollable}>
            {
              showOnboarding
              && onboardingContent
              && (
                <Onboarding
                  content={onboardingContent}
                  className={styles.lp_banner}
                  onDone={() => setOnboardingHidden(true)}
                />
              )
            }
            <ErrorBoundary fallback={() => <PageError />}>
              {
                secondLevelNavConfig && contentWidth !== 'app'
                  ? (
                    <ContainerWithNav
                      contentWidth={contentWidth}
                    >
                      <SecondLevelNav config={secondLevelNavConfig} />
                      {children}
                    </ContainerWithNav>
                  )
                  : (
                    <div className={classNames(styles.container, styles[`container_${contentWidth}`], styles.container_center)}>
                      {children}
                    </div>
                  )
              }
            </ErrorBoundary>
          </div>
          <div className={styles.footer}>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};
