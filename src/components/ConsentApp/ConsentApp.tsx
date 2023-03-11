import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CurrentUserProvider } from '../../hooks/currentUser';
import { ActionCableProvider } from '../../hooks/actionCable';
import { PlatformsProvider } from '../../hooks/platforms';
import { ToastContainer } from '../../components/Toast/ToastContainer';
import { CONSOLE_BASE_ROUTE } from '../../routes/routes';
import { ConfirmationProvider } from '../../components/Confirmation/ConfirmationProvider';

import { LayoutCentered } from '../../components/Layout/LayoutCentered/LayoutCentered';
import { ConsentForm } from '../ConsentForm/ConsentForm';
import { ConsentProps } from '../../types';
import { ProjectsProvider } from '../../app/hooks/projectsContext';
import { AppProvider } from '../../app/hooks/app';

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
