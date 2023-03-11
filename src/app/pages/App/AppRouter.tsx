import React from 'react';
import {
  generatePath, Link, Redirect, Route, Switch,
} from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { PageError } from '../../../components/PageError/PageError';
import { BillingSubscriptionType, Project } from '../../../api/publicv2';
import { MODAL_ENROLL_TO_PRO_QUERY_KEY } from '../../../components/EnrollToPro/enrollToProContext';
import { TrackingRoute } from '../../../utils/analytics';
import { ConsoleRoutes, ConsoleRoutesObsolete } from '../../../routes/routes';
import { useNewItemModals } from '../../../hooks/useNewItem';
import { LayoutWithSideNavProps } from '../../../components/Layout/LayoutWithSideNav/LayoutWithSideNav';
import notFoundImg from '../../../assets/images/error_hdd.webp';
import { Button } from '../../../components/Button/Button';
import { useCurrentUser } from '../../../hooks/currentUser';
import { ConsoleLayout } from '../../../components/ConsoleLayout/ConsoleLayout';
import { Projects } from '../Projects/Projects';

import { ProjectsItemProvider, useProjectsItemContext } from '../../hooks/projectsItem';
import { ProjectsDashboard } from '../ProjectDashboard/ProjectsDashboard';
import { ProjectOperations } from '../ProjectOperations/ProjectOperations';
import { Query } from '../Query/Query';
import { UserSettingsApiKeys } from '../UserSettingsApiKeys/UserSettingsApiKeys';
import { CONTENT } from '../../config/onboarding';
import { ProjectSettingsGeneral } from '../ProjectSettings/ProjectSettingsGeneral';
import { UserSettingsAccount } from '../UserSettingsAccount/UserSettingsAccount';
import { ProjectDatabases } from '../ProjectDatabases/ProjectDatabases';
import { ProjectRoles } from '../ProjectRoles/ProjectRoles';
import { useAppContext } from '../../hooks/app';
import { Tables } from '../Tables/Tables';
import { ProjectsBranchesNew } from '../ProjectBranchesNew/ProjectBranchesNew';
import { ProjectBranches } from '../ProjectBranches/ProjectBranches';
import { ProjectBranchesItem } from '../ProjectBranchesItem/ProjectBranchesItem';
import { Insights } from '../Insights/Insights';
import { BillingPage } from '../Billing/Billing';
import { ProjectIntegrations } from '../ProjectIntegrations/ProjectIntegrations';
import { useProjectsContext } from '../../hooks/projectsContext';
import { PsqlConnectBanner } from '../../../components/PsqlConnectBanner/PsqlConnectBanner';

const PsqlBannerIfNecessary = () => {
  const { list } = useProjectsContext();
  return (
    <>
      {list.length > 0 && <PsqlConnectBanner />}
    </>
  );
};

const USER_NAV: LayoutWithSideNavProps['secondLevelNavConfig'] = [
  {
    id: 'account',
    children: 'Account',
    to: ConsoleRoutes.UserSettingsAccount,
  },
  {
    id: 'dev_settings',
    children: 'Developer Settings',
    to: ConsoleRoutes.UserSettingsApiKeys,
  },
];

const createProjectSettingsSideNav:
(cId: Project['id'], integrationsEnabled: boolean) => LayoutWithSideNavProps['secondLevelNavConfig'] = () => ([]);

const ConsoleNotFound = () => (
  <ConsoleLayout
    pageHeader="Not found"
  >
    <PageError preset={404} />
  </ConsoleLayout>
);

const withConsoleLayout = (
  Component: React.ComponentType<any>,
  layoutProps: LayoutWithSideNavProps = {},
) => {
  const wrapped = (props: LayoutWithSideNavProps) => (
    <ConsoleLayout
      {...layoutProps}
    >
      <Component {...props} />
    </ConsoleLayout>
  );
  wrapped.displayName = `withConsoleLayout(${Component.displayName})`;

  return wrapped;
};

const withProjectConsoleLayout = (
  Component: React.ComponentType<any>,
  layoutProps: LayoutWithSideNavProps = {},
  sideNavGenerator?: (
    cId: Project['id'], integrationsEnabled: boolean
  ) => LayoutWithSideNavProps['secondLevelNavConfig'],
) => {
  const wrapped = React.memo((props: any) => {
    const {
      projectId, project, isLoading, error,
    } = useProjectsItemContext();
    const { isFeatureEnabled } = useAppContext();
    const roleCreatedModal = useNewItemModals('role');

    if (!isLoading && (!project || error)) {
      return (
        <ConsoleLayout>
          <PageError
            title={error || 'Something went wrong'}
            imgSrc={notFoundImg}
            actions={(
              <Button
                as={Link}
                to={ConsoleRoutes.ProjectsList}
                size="l"
              >
                Back to Project List
              </Button>
            )}
          />
        </ConsoleLayout>
      );
    }

    return (
      <>
        {roleCreatedModal}
        <ConsoleLayout
          {...layoutProps}
          showOnboarding={layoutProps.showOnboarding && !error}
          onboardingContent={CONTENT}
          secondLevelNavConfig={sideNavGenerator && sideNavGenerator(projectId, isFeatureEnabled('integrations'))}
          projectId={projectId}
          project={(error || isLoading) ? undefined : project}
        >
          <Component {...props} />
        </ConsoleLayout>
      </>
    );
  });
  wrapped.displayName = `withProjectConsoleLayout(${Component.displayName})`;

  return wrapped;
};

const BranchPreviewSwitch = React.memo(({ children }: any) => (
  <Switch>
    {children}
    <TrackingRoute component={ConsoleNotFound} />
  </Switch>
));
BranchPreviewSwitch.displayName = 'BranchPreviewSwitch';

const AppRouter = () => {
  const { isFeatureEnabled } = useAppContext();
  const { user } = useCurrentUser();
  return (
    <Switch>
      <Route path={ConsoleRoutes.ProjectsItem}>
        {({ match }) => (
          <ProjectsItemProvider projectId={match?.params.projectId ?? ''}>
            <Switch>
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItem}
                exact
                component={withProjectConsoleLayout(
                  ProjectsDashboard,
                  {
                    contentWidth: 'l',
                    showOnboarding: true,
                  },
                )}
              />
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemQuery}
                exact
                component={withProjectConsoleLayout(
                  Query,
                  {
                    contentWidth: 'app',
                  },
                )}
              />
              {isFeatureEnabled('computeInsights') && (
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemInsigts}
                exact
                component={withProjectConsoleLayout(
                  Insights,
                  {
                    contentWidth: 'app',
                  },
                )}
              />
              )}
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemTables}
                exact
                component={withProjectConsoleLayout(
                  Tables,
                  {
                    contentWidth: 'app',
                  },
                )}
              />
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemOperations}
                exact
                component={withProjectConsoleLayout(
                  ProjectOperations,
                  {
                    contentWidth: 'm',
                  },
                )}
              />
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemIntegrations}
                exact
                component={withProjectConsoleLayout(
                  ProjectIntegrations,
                  {
                    contentWidth: 'm',
                  },
                )}
              />
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemSettingsGeneral}
                exact
                component={withProjectConsoleLayout(
                  ProjectSettingsGeneral,
                  {
                    contentWidth: 's',
                  },
                  createProjectSettingsSideNav,
                )}
              />
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemSettingsOperations}
                exact
                component={(props: RouteComponentProps<any>) => (
                  <Redirect
                    to={generatePath(
                      ConsoleRoutes.ProjectsItemSettingsOperations,
                      props.match.params,
                    )}
                  />
                )}
              />
              <Redirect
                from={ConsoleRoutes.ProjectsItemSettingsDatabases}
                exact
                to={ConsoleRoutes.ProjectsItemDatabases}
              />
              <Redirect
                path={ConsoleRoutesObsolete.ProjectsItemUsers}
                exact
                to={ConsoleRoutes.ProjectsItemRoles}
              />
              <Redirect
                path={ConsoleRoutesObsolete.ProjectsItemSettingsUsers}
                exact
                to={ConsoleRoutes.ProjectsItemRoles}
              />
              <Redirect
                from={ConsoleRoutes.ProjectsItemSettings}
                to={ConsoleRoutes.ProjectsItemSettingsGeneral}
                exact
              />
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemDatabases}
                exact
                component={withProjectConsoleLayout(
                  ProjectDatabases,
                  {
                    contentWidth: 's',
                  },
                )}
              />
              <TrackingRoute
                path={ConsoleRoutes.ProjectsItemRoles}
                exact
                component={withProjectConsoleLayout(
                  ProjectRoles,
                  {
                    contentWidth: 's',
                  },
                )}
              />
              <BranchPreviewSwitch>
                <TrackingRoute
                  path={ConsoleRoutes.ProjectsItemBranches}
                  exact
                  component={withProjectConsoleLayout(
                    ProjectBranches,
                  )}
                />
                <TrackingRoute
                  path={ConsoleRoutes.ProjectsItemBranchesNew}
                  exact
                  component={withProjectConsoleLayout(
                    ProjectsBranchesNew,
                    {
                      contentWidth: 's',
                    },
                  )}
                />
                <TrackingRoute
                  path={ConsoleRoutes.ProjectsItemBranchesItem}
                  exact
                  component={withProjectConsoleLayout(
                    ProjectBranchesItem,
                    {
                      // contentWidth: 'app',
                      contentWidth: 'm',
                    },
                  )}
                />
              </BranchPreviewSwitch>
              <TrackingRoute component={ConsoleNotFound} />
            </Switch>
          </ProjectsItemProvider>
        )}
      </Route>
      <TrackingRoute
        path={ConsoleRoutes.ProjectsList}
        exact
        component={withConsoleLayout(Projects, {
          footer: <PsqlBannerIfNecessary />,
        })}
      />
      <TrackingRoute
        path={ConsoleRoutes.UserSettingsApiKeys}
        exact
        component={withConsoleLayout(UserSettingsApiKeys, {
          secondLevelNavConfig: USER_NAV,
          contentWidth: 's',
        })}
      />
      <TrackingRoute
        path={ConsoleRoutes.UserSettingsAccount}
        exact
        component={withConsoleLayout(UserSettingsAccount, {
          secondLevelNavConfig: USER_NAV,
          contentWidth: 's',
        })}
      />
      {isFeatureEnabled('usageConsumption') && (
        user.billingAccount.subscription_type === BillingSubscriptionType.Free ? (
          <Redirect
            from={ConsoleRoutes.UserBilling}
            to={{
              pathname: ConsoleRoutes.ProjectsList,
              search: `${MODAL_ENROLL_TO_PRO_QUERY_KEY}=true`,
            }}
          />
        ) : (
          <TrackingRoute
            path={ConsoleRoutes.UserBilling}
            exact
            component={withConsoleLayout(BillingPage, {
              contentWidth: 'app',
            })}
          />
        )
      )}
      <Redirect from={ConsoleRoutes.UserSettings} to={ConsoleRoutes.UserSettingsAccount} exact />
      <Redirect from={ConsoleRoutes.Home} to={ConsoleRoutes.ProjectsList} exact />
      <Redirect from={ConsoleRoutes.Root} to={ConsoleRoutes.ProjectsList} exact />
      <Route component={ConsoleNotFound} />
    </Switch>
  );
};

export { AppRouter };
