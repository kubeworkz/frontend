import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from '../../../components/Toast/ToastContainer';
import { ConfirmationProvider } from '../../../components/Confirmation/ConfirmationProvider';
import { useBrowserDetect } from '../../../hooks/browserDetect';
import { ActionCableProvider } from '../../../hooks/actionCable';
import { Platform, PlatformsProvider } from '../../../hooks/platforms';
import { CurrentUserProvider } from '../../../hooks/currentUser';

import { CONSOLE_BASE_ROUTE, ConsoleRoutes } from '../../../routes/routes';
import { Settings } from '../../../hooks/settings';
import { PgSettingInternal } from '../../../hooks/pgSettings';
import { NewItemProvider } from '../../../hooks/useNewItem';
import { BreadcrumbsContext } from '../../../components/Breadcrumbs/Breadcrumbs';
import { createBreadcrumbs } from '../../../components/Breadcrumbs/createBreadcrumbs';
import { EnrollToProContainer } from '../../../components/EnrollToPro/EnrollToProContainer';
import { EnrollToProProvider } from '../../../components/EnrollToPro/enrollToProContext';
import { BillingSubscriptionType } from '../../../api/generated/api_public_v2';
import { AppProvider, ConsoleFeatures } from '../../hooks/app';
import { ProjectsProvider } from '../../hooks/projectsContext';
import { ROUTES_BREADCRUMBS_LABELS } from '../../config/routes_mapper';
import { AppRouter } from './AppRouter';

// import './App.css';

interface BillingAccount {
  SubscriptionType: BillingSubscriptionType
}

interface AppProps {
  platforms: Platform[];
  pgSettings: PgSettingInternal[];
  consoleSettings: Settings;
  features: ConsoleFeatures;
  appVersion: string;
  psqlConnectHost: string;
  billingAccount: BillingAccount
}

// authorization is handled by go app
// and if someone can see the console it means they are logged in
const App = ({
  platforms,
  pgSettings,
  consoleSettings,
  appVersion,
  psqlConnectHost,
  features = {},
  billingAccount,
}: AppProps) => {
  useBrowserDetect();

  return (
    <ConfirmationProvider>
      <ActionCableProvider>
        <PlatformsProvider
          platforms={platforms}
        >
          <AppProvider
            pgSettings={pgSettings}
            consoleSettings={consoleSettings}
            features={features}
            appVersion={appVersion}
            psqlConnectHost={psqlConnectHost}
          >
            <CurrentUserProvider initialSubscriptionType={billingAccount.SubscriptionType}>
              <ProjectsProvider>
                <NewItemProvider>
                  <ToastContainer />
                  <BreadcrumbsContext.Provider
                    value={{
                      data: createBreadcrumbs({
                        routes: ConsoleRoutes, names: ROUTES_BREADCRUMBS_LABELS,
                      }),
                    }}
                  >
                    <BrowserRouter basename={CONSOLE_BASE_ROUTE}>
                      <EnrollToProProvider>
                        <EnrollToProContainer />
                        <AppRouter />
                      </EnrollToProProvider>
                    </BrowserRouter>
                  </BreadcrumbsContext.Provider>
                </NewItemProvider>
              </ProjectsProvider>
            </CurrentUserProvider>
          </AppProvider>
        </PlatformsProvider>
      </ActionCableProvider>
    </ConfirmationProvider>
  );
};

export { App };
