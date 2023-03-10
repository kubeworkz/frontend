import { AuthRoutes } from '#shared/routes';

export const ANALYTICS_PAGE_MAPPER: Record<AuthRoutes, string> = {
  [AuthRoutes.EnterInvite]: 'enter_invite',
  [AuthRoutes.PsqlSession]: 'psql_session',
  [AuthRoutes.SignInMain]: 'sign_in',
  [AuthRoutes.SignInOauth]: 'oauth_sign_in',
};
