export enum PsqlConnectRoutes {
  List = '/',
  Endpoints = '/endpoints',
  NewProject = '/new',
  Success = '/success',
  Error = '/error',
}

export const AnalyticsPageMapper = {
  [PsqlConnectRoutes.List]: 'projects_list',
  [PsqlConnectRoutes.Endpoints]: 'projects_endpoints',
  [PsqlConnectRoutes.NewProject]: 'projects_create',
  [PsqlConnectRoutes.Success]: 'connection_succeed',
  [PsqlConnectRoutes.Error]: 'error',
};
