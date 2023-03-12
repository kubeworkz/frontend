import { LOGIN_URL, CONSENT_URL, OAUTH_LOGIN_URL } from '../../../config/env';

export const navigateToLoginPage = () => window.location.assign(
  `${
    window.location.pathname === CONSENT_URL ? OAUTH_LOGIN_URL : LOGIN_URL
  }?ref=${window.location.pathname}`,
);
