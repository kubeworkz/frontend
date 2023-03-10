import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ToastContainer } from '#shared/components/Toast/ToastContainer';
import { ConfirmationProvider } from '#shared/components/Confirmation/ConfirmationProvider';
import { useBrowserDetect } from '#shared/hooks/browserDetect';
import { ActionCableProvider } from '#shared/hooks/actionCable';
import { Platform, PlatformsProvider } from '#shared/hooks/platforms';
import { CurrentUserProvider } from '#shared/hooks/currentUser';

import { CONSOLE_BASE_ROUTE, ConsoleRoutes } from '#shared/routes';
import { Settings } from '#shared/hooks/settings';
import { PgSettingInternal } from '#shared/hooks/pgSettings';
import { NewItemProvider } from '#shared/hooks/useNewItem';
import { BreadcrumbsContext } from '#shared/components/Breadcrumbs/Breadcrumbs';
import { createBreadcrumbs } from '#shared/components/Breadcrumbs/createBreadcrumbs';
import { EnrollToProContainer } from '#shared/components/EnrollToPro/EnrollToProContainer';
import { EnrollToProProvider } from '#shared/components/EnrollToPro/enrollToProContext';
import { BillingSubscriptionType } from '#api_client/generated/api_public_v2';
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
