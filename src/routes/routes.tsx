export const CONSOLE_BASE_ROUTE = '/app';

export enum ConsoleRoutesObsolete {
  ProjectsItemSettingsUsers = '/projects/:projectId/settings/users',
  ProjectsItemUsers = '/projects/:projectId/users',
}

export enum ConsoleRoutes {
  Root = '/',
  Home = '/home',
  ProjectsList = '/projects',
  ProjectsItem = '/projects/:projectId',
  ProjectsItemQuery = '/projects/:projectId/query',
  ProjectsItemInsigts = '/projects/:projectId/insights',
  ProjectsItemTables = '/projects/:projectId/tables',
  ProjectsItemOperations = '/projects/:projectId/operations',
  ProjectsItemSettings = '/projects/:projectId/settings',
  ProjectsItemSettingsGeneral = '/projects/:projectId/settings/general',
  ProjectsItemSettingsOperations = '/projects/:projectId/settings/operations',
  ProjectsItemSettingsDatabases = '/projects/:projectId/settings/databases',
  ProjectsItemDatabases = '/projects/:projectId/databases',
  ProjectsItemRoles = '/projects/:projectId/roles',
  ProjectsItemIntegrations = '/projects/:projectId/integrations',
  ProjectsItemBranches = '/projects/:projectId/branches',
  ProjectsItemBranchesNew = '/projects/:projectId/branches/new',
  ProjectsItemBranchesItem = '/projects/:projectId/branches/:branchId',
  ProjectsItemBranchesItemEndpointsNew = '/projects/:projectId/branches/:branchId/add_endpoint',
  ProjectsItemEndpoints = '/projects/:projectId/endpoints',
  ProjectsItemEndpointsNew = '/projects/:projectId/endpoints/new',
  ProjectsItemEndpointsItem = '/projects/:projectId/endpoints/:endpointId',
  ProjectsItemEndpointsItemEdit = '/projects/:projectId/endpoints/:endpointId/edit',
  UserBilling = '/billing',
  UserSettings = '/settings',
  UserSettingsApiKeys = '/settings/api-keys',
  UserSettingsAccount = '/settings/account',
}

export const ADMIN_BASE_ROUTE = '/admin';
export const INTEGRATIONS_BASE_ROUTE = '/integrations';

export enum IntegrationsRoutes {
  Vercel = '/vercel',
}

export enum BillingRoutes {
  StripeSessionSetup = '/billing/stripe_session_setup',
}

export enum AuthRoutes {
  EnterInvite = '/enter_invite',
  PsqlSession = '/psql_session',
  SignInMain = '/sign_in',
  SignInOauth = '/oauth_sign_in',
}
