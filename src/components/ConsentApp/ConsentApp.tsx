import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CurrentUserProvider } from '#shared/hooks/currentUser';
import { ActionCableProvider } from '#shared/hooks/actionCable';
import { PlatformsProvider } from '#shared/hooks/platforms';
import { ToastContainer } from '#shared/components/Toast/ToastContainer';
import { CONSOLE_BASE_ROUTE } from '#shared/routes';
import { ConfirmationProvider } from '#shared/components/Confirmation/ConfirmationProvider';

import { LayoutCentered } from '#shared/components/Layout/LayoutCentered/LayoutCentered';
import { ConsentForm } from '../ConsentForm/ConsentForm';
import { ConsentProps } from '../../types';
import { ProjectsProvider } from '../../../console/hooks/projectsContext';
import { AppProvider } from '../../../console/hooks/app';

export const ConsentApp = (props: ConsentProps) => (
  <BrowserRouter basename={CONSOLE_BASE_ROUTE} forceRefresh>
    <ActionCableProvider>
      <ConfirmationProvider>
        <AppProvider
          appVersion={props.appVersion}
          pgSettings={[]}
          psqlConnectHost=""
          consoleSettings={{
            projectCreationForbidden: false,
          }}
        >
          <PlatformsProvider platforms={props.platforms}>
            <CurrentUserProvider>
              <ProjectsProvider>
                <ToastContainer />
                <LayoutCentered
                  disableSignOut
                >
                  <ConsentForm {...props} />
                </LayoutCentered>
              </ProjectsProvider>
            </CurrentUserProvider>
          </PlatformsProvider>
        </AppProvider>
      </ConfirmationProvider>
    </ActionCableProvider>
  </BrowserRouter>
);
