import React, { HTMLAttributes, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { BillingSubscriptionType, Project } from '#api_client/publicv2';

import { AnyLinkConfig } from '#shared/components/AnyLink/AnyLink';
import { ConsoleRoutes } from '#shared/routes';
// import { useUserContext } from '../../context/user';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { captureMessage } from '@sentry/react';
import { WEBSITE_URL } from '#shared/config';
import {
  LayoutWithSideNav,
  LayoutWithSideNavProps,
} from '#shared/components/Layout/LayoutWithSideNav/LayoutWithSideNav';
import { BreadcrumbsContainer } from '#shared/components/Breadcrumbs/Breadcrumbs';
import { ActionsDropdownItem } from '#shared/components/ActionsDropdown/ActionDropdownItem/ActionsDropdownItem';
import { EnrollToProConditional } from '#shared/components/EnrollToPro/EnrollToPro';
import { useCurrentUser } from '#shared/hooks/currentUser';
import { Badge } from '#shared/components/Badge/Badge';
import { ROUTES_ICONS, ROUTES_NAMES } from '../../config/routes_mapper';
import { useAppContext } from '../../hooks/app';

import styles from './ConsoleLayout.module.css';

const getProjectRoute = (route: string, projectId?: string) => (location: any) => ({
  pathname: (projectId ? route.replace(':projectId', projectId) : ''),
  search: location.search,
});

const ANALYTICS_ROUTE_MAPPER: Partial<Record<ConsoleRoutes, AnalyticsAction>> = {
  [ConsoleRoutes.ProjectsItem]: AnalyticsAction.ProjectNavDashboardClicked,
  [ConsoleRoutes.ProjectsItemTables]: AnalyticsAction.ProjectNavTablesClicked,
  [ConsoleRoutes.ProjectsItemQuery]: AnalyticsAction.ProjectNavSqlEditorClicked,
  [ConsoleRoutes.ProjectsItemInsigts]: AnalyticsAction.ProjectNavInsightsClicked,
  [ConsoleRoutes.ProjectsItemBranches]: AnalyticsAction.ProjectNavBranchesClicked,
  [ConsoleRoutes.ProjectsItemEndpoints]: AnalyticsAction.ProjectNavEndpointsClicked,
  [ConsoleRoutes.ProjectsItemSettings]: AnalyticsAction.ProjectNavSettingsClicked,
  [ConsoleRoutes.ProjectsItemOperations]: AnalyticsAction.ProjectNavOperationsClicked,
  [ConsoleRoutes.ProjectsList]: AnalyticsAction.ProjectNavProjectsListClicked,
  [ConsoleRoutes.UserBilling]: AnalyticsAction.ProjectNavBillingClicked,
};

interface ConsoleLayoutProps extends LayoutWithSideNavProps {
  project?: Project;
  projectId?: Project['id'];
}

const ConsoleLayout = React.memo((
  {
    project,
    projectId,
    ...props
  }: PropsWithChildren<ConsoleLayoutProps> & LayoutWithSideNavProps,
) => {
  const { trackUiInteraction } = useAnalytics();
  const { isFeatureEnabled } = useAppContext();
  const { user } = useCurrentUser();
  // const { confirm } = useConfirmation();

  const { pathname } = useLocation();

  const generateRouteObject = React.useCallback((route: ConsoleRoutes, {
    exact = false,
    projectId: pId,
  }: {
    exact?: boolean,
    projectId?: string,
  }) => {
    const action = ANALYTICS_ROUTE_MAPPER[route];
    if (!action) {
      captureMessage(`Missing analytics for the project navigation item ${ROUTES_NAMES[route]}`);
    }
    const onClick = action
      ? () => trackUiInteraction(action)
      : undefined;

    return {
      id: route,
      to: pId ? getProjectRoute(route, pId) : route,
      children: ROUTES_NAMES[route],
      onClick,
      iconName: ROUTES_ICONS[route],
      exact,
    };
  }, [trackUiInteraction]);

  const topNavConfig: LayoutWithSideNavProps['firstLevelNavConfig'] = React.useMemo(
    () => {
      if (projectId) {
        return [
          [
            ConsoleRoutes.ProjectsItem,
            ConsoleRoutes.ProjectsItemBranches,
            ConsoleRoutes.ProjectsItemTables,
            ConsoleRoutes.ProjectsItemQuery,
            isFeatureEnabled('computeInsights') && ConsoleRoutes.ProjectsItemInsigts,
            ConsoleRoutes.ProjectsItemOperations,
            ConsoleRoutes.ProjectsItemSettings,
            ConsoleRoutes.ProjectsItemIntegrations,
          ].filter((route): route is ConsoleRoutes => Boolean(route))
            .map((route) => generateRouteObject(route, {
              exact: route === ConsoleRoutes.ProjectsItem,
              projectId,
            })),
          [
            ConsoleRoutes.ProjectsItemRoles,
            ConsoleRoutes.ProjectsItemDatabases,
          ].map((route) => generateRouteObject(route, {
            projectId,
          })),
        ];
      }

      return [[
        ConsoleRoutes.ProjectsList,
        isFeatureEnabled('usageConsumption') && ConsoleRoutes.UserBilling,
      ]
        .filter((route): route is ConsoleRoutes => Boolean(route))
        .map((r) => generateRouteObject(r, {
          exact: true,
        })),
      ];
    },
    [pathname, projectId, isFeatureEnabled, generateRouteObject],
  );

  const userMenuConfig: (AnyLinkConfig | React.ReactNode)[] = [
    {
      to: ConsoleRoutes.UserSettings,
      trackClick: AnalyticsAction.UserMenuAccountClicked,
      children: 'Account',
    },
    isFeatureEnabled('usageConsumption') && {
      to: ConsoleRoutes.UserBilling,
      trackClick: AnalyticsAction.UserMenuBillingClicked,
      children: 'Billing',
    },
    {
      as: 'a',
      href: WEBSITE_URL,
      target: '_blank',
      trackClick: AnalyticsAction.UserMenuWebsiteClicked,
      children: 'Website',
    },
    <EnrollToProConditional
      as={(p: HTMLAttributes<HTMLButtonElement>) => <ActionsDropdownItem as="button" {...p} />}
      onClick={() => trackUiInteraction(AnalyticsAction.UserMenuUpgradeToProClicked)}
    />,
  ].filter(Boolean);

  const quickNavNode = React.useMemo(() => (
    <div className={styles.quickNav}>
      {
          user && user.billingAccount.subscription_type === BillingSubscriptionType.Pro
          && (<Badge appearance="cloudrock" noMargins size="m">Pro</Badge>)
        }
      {
          user && user.billingAccount.subscription_type === BillingSubscriptionType.Free
          && (<Badge noMargins size="m" appearance="primary">Free tier</Badge>)
        }
      <EnrollToProConditional
        className={styles.enrollToPro}
        onClick={() => trackUiInteraction(AnalyticsAction.PageHeaderUpgradeToProClicked)}
      />
    </div>
  ), [user, trackUiInteraction]);

  return (
    <LayoutWithSideNav
      {...props}
      userMenuConfig={userMenuConfig}
      firstLevelNavConfig={topNavConfig}
      logoLinkConfig={{
        to: '/',
        onClick: () => trackUiInteraction(AnalyticsAction.LogoClicked),
      }}
      showHelp
      showLimitedPreviewBanner
      pageHeader={<BreadcrumbsContainer />}
      quickNav={quickNavNode}
    />
  );
});

ConsoleLayout.displayName = 'ConsoleLayout';

export { ConsoleLayout };
