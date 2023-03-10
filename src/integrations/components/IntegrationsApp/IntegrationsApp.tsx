import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CurrentUserProvider } from '#shared/hooks/currentUser';
import { ToastContainer } from '#shared/components/Toast/ToastContainer';
import { INTEGRATIONS_BASE_ROUTE } from '#shared/routes';
import { ActionCableProvider } from '#shared/hooks/actionCable';
import { PlatformsProvider } from '#shared/hooks/platforms';
import { ConfirmationProvider } from '#shared/components/Confirmation/ConfirmationProvider';

import { LayoutCentered } from '#shared/components/Layout/LayoutCentered/LayoutCentered';
import { IntegrationsProps } from '../../types';
import { ProjectsProvider } from '../../../console/hooks/projectsContext';
import { AppProvider } from '../../../console/hooks/app';
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
