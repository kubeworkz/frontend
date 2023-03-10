import React, { PropsWithChildren } from 'react';
import {
  LayoutWithSideNav,
  LayoutWithSideNavProps,
} from '#shared/components/Layout/LayoutWithSideNav/LayoutWithSideNav';
import { LayoutNavProps } from '#shared/components/Layout/types';
import { AdminRoutes } from '../../config/routes';

const TOP_NAV_CONFIG: LayoutNavProps['firstLevelNavConfig'] = [
  {
    to: AdminRoutes.ProjectsList,
    children: 'Projects',
    id: 'Projects',
  },
  {
    to: AdminRoutes.BranchesList,
    children: 'Branches',
    id: 'Branches',
  },
  {
    to: AdminRoutes.EndpointsList,
    children: 'Endpoints',
    id: 'Endpoints',
  },
  {
    to: AdminRoutes.OperationsList,
    children: 'Operations',
    id: 'Operations',
  },
  {
    to: AdminRoutes.UsersList,
    children: 'Users',
    id: 'Users',
  },
  {
    to: AdminRoutes.PageserversList,
    children: 'Pageservers',
    id: 'Pageservers',
  },
  {
    to: AdminRoutes.SafekeepersList,
    children: 'Safekeepers',
    id: 'Safekeepers',
  },
  {
    to: AdminRoutes.PlatformsList,
    children: 'Platforms',
    id: 'Platforms',
  },
  {
    to: AdminRoutes.InvitesList,
    children: 'Invites',
    id: 'Invites',
  },
  {
    to: AdminRoutes.ConsoleSettings,
    children: 'Settings',
    id: 'settings',
  },
  {
    as: 'a',
    href: '/',
    children: 'Console',
    id: 'Console',
    target: '_blank',
  },
  {
    as: 'a',
    target: '_blank',
    children: 'API v1 ref',
    href: '/api-ref/v1',
  },
  {
    as: 'a',
    target: '_blank',
    children: 'API v2 ref',
    href: '/api-ref/v2',
  },
];

export const AdminLayout = (props: PropsWithChildren<Partial<LayoutWithSideNavProps>>) => (
  <LayoutWithSideNav
    firstLevelNavConfig={TOP_NAV_CONFIG}
    contentWidth="l"
    showLimitedPreviewBanner={false}
    userMenuConfig={[]}
    showHelp={false}
    pageHeader="Admin"
    {...props}
  />
);
