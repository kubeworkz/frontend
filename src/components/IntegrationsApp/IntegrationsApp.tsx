import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CurrentUserProvider } from '../../hooks/currentUser';
import { ToastContainer } from '../../components/Toast/ToastContainer';
import { INTEGRATIONS_BASE_ROUTE } from '../../routes/routes';
import { ActionCableProvider } from '../../hooks/actionCable';
import { PlatformsProvider } from '../../hooks/platforms';
import { ConfirmationProvider } from '../../components/Confirmation/ConfirmationProvider';

import { LayoutCentered } from '../../components/Layout/LayoutCentered/LayoutCentered';
import { IntegrationsProps } from '../../types';
import { ProjectsProvider } from '../../app/hooks/projectsContext';
import { AppProvider } from '../../app/hooks/app';
import { IntegrationsRouter } from './IntegrationsRouter';

export const IntegrationsApp = (props: IntegrationsProps) => (
  <BrowserRouter basename={INTEGRATIONS_BASE_ROUTE}>
    <ConfirmationProvider>
      <ActionCableProvider>
        <PlatformsProvider
          platforms={props.platforms}
        >
          <AppProvider
            appVersion=""
            consoleSettings={{ projectCreationForbidden: false }}
            pgSettings={[]}
            psqlConnectHost=""
          >
            <CurrentUserProvider>
              <ProjectsProvider>
                <ToastContainer />
                <LayoutCentered
                  logoLinkConfig={{ as: 'div' }}
                  disableSignOut
                >
                  <IntegrationsRouter {...props} />
                </LayoutCentered>
              </ProjectsProvider>
            </CurrentUserProvider>
          </AppProvider>
        </PlatformsProvider>
      </ActionCableProvider>
    </ConfirmationProvider>
  </BrowserRouter>
);
