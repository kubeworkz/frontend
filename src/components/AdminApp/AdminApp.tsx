import React from 'react';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';

import { Text } from '../../components/Text/Text';

import { ConfirmationProvider } from '../../components/Confirmation/ConfirmationProvider';
import { ToastContainer } from '../../components/Toast/ToastContainer';
import { CurrentUserProvider } from '../../hooks/currentUser';
import { ADMIN_BASE_ROUTE } from '../../routes/routes';
import { AdminLayout } from '../AdminLayout/AdminLayout';
import { SafekeepersItem as SafekeepersItemComponent } from '../SafekeepersItem/SafekeepersItem';
import { ProjectsList as ProjectsListComponent } from '../ProjectsList/ProjectsList';
import { ProjectsItem as ProjectsItemComponent } from '../ProjectsItem/ProjectsItem';
import { UsersList as UsersListComponent } from '../UsersList/UsersList';
import { UsersItem as UsersItemComponent } from '../UsersItem/UsersItem';
import { PageserversList as PageserversListComponent } from '../PageserversList/PageserversList';
import { PageserversItem as PageserversItemComponent } from '../PageserversItem/PageserversItem';
import { SafekeepersList as SafekeepersListComponent } from '../SafekeepersList/SafekeepersList';
import { PlatformsList } from '../PlatformsList/PlatformsList';
import { OperationsList } from '../OperationsList/OperationsList';
import { OperationsItem } from '../OperationsItem/OperationsItem';

import { UserCacheProvider, SafekeeperCacheProvider, PageserverCacheProvider } from '../../admin/utils/caches';

import { AdminRoutes } from '../../admin/config/routes';
import { InvitesList } from '../InvitesList/InvitesList';
import { ConsoleSettings } from '../ConsoleSettings/ConsoleSettings';
import { BranchesList } from '../BranchesList/BranchesList';
import { BranchesItem } from '../BranchesItem/BranchesItem';
import { EndpointsList } from '../EndpointsList/EndpointsList';
import { EndpointsItem } from '../EndpointsItem/EndpointsItem';
import { AdminAppProps } from './types';

export const Routes: { [key in AdminRoutes]?: Function } = {
  [AdminRoutes.ProjectsList]: ProjectsListComponent,
  [AdminRoutes.ProjectsItem]: ProjectsItemComponent,
  [AdminRoutes.BranchesList]: BranchesList,
  [AdminRoutes.BranchesItem]: BranchesItem,
  [AdminRoutes.EndpointsList]: EndpointsList,
  [AdminRoutes.EndpointsItem]: EndpointsItem,
  [AdminRoutes.UsersList]: UsersListComponent,
  [AdminRoutes.UsersItem]: UsersItemComponent,
  [AdminRoutes.PageserversList]: PageserversListComponent,
  [AdminRoutes.PageserversItem]: PageserversItemComponent,
  [AdminRoutes.SafekeepersList]: SafekeepersListComponent,
  [AdminRoutes.SafekeepersItem]: SafekeepersItemComponent,
  [AdminRoutes.PlatformsList]: PlatformsList,
  [AdminRoutes.OperationsList]: OperationsList,
  [AdminRoutes.OperationsItem]: OperationsItem,
  [AdminRoutes.InvitesList]: InvitesList,
  // [AdminRoutes.ConsoleSettings]: ConsoleSettings,
};

const AdminAppRouter = (props: AdminAppProps) => (
  <BrowserRouter
    basename={ADMIN_BASE_ROUTE}
    forceRefresh
  >
    {props.error
      ? (
        <Route>
          <Text appearance="secondary">{props.error}</Text>
        </Route>
      )
      : (
        <Switch>
          <Redirect exact from="/" to={AdminRoutes.ProjectsList} />
          {Object.entries(Routes).map(([route, Component]) => (
            <Route
              key={route}
              exact
              path={route}
              render={() => (
                <AdminLayout>
                  <Component
                    {...props.appData}
                    consoleEnv={props.consoleEnv}
                    grafana={props.grafana}
                  />
                </AdminLayout>
              )}
            />
          ))}
          <Route
            exact
            path={AdminRoutes.ConsoleSettings}
            render={() => (
              <AdminLayout
                contentWidth="m"
              >
                <ConsoleSettings {...props.appData} />
              </AdminLayout>
            )}
          />
        </Switch>
      )}
  </BrowserRouter>
);

export const AdminApp = (props: AdminAppProps) => (
  <ConfirmationProvider>
    <ToastContainer />
    <UserCacheProvider>
      <SafekeeperCacheProvider>
        <PageserverCacheProvider>
          <CurrentUserProvider>
            <AdminAppRouter {...props} />
          </CurrentUserProvider>
        </PageserverCacheProvider>
      </SafekeeperCacheProvider>
    </UserCacheProvider>
  </ConfirmationProvider>
);
