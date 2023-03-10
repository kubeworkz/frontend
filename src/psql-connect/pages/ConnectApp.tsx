import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Project } from '../../api/publicv2';
import { CurrentUserProvider } from '../../hooks/currentUser';
import { Platform, PlatformsProvider } from '../../hooks/platforms';
import { ConfirmationProvider } from '../../components/Confirmation/ConfirmationProvider';
import { ActionCableProvider } from '../../hooks/actionCable';
import { AppProvider } from '../console/hooks/app';
import { ConnectAppProvider } from '../context/connectApp';
import { PsqlConnectRoutes } from '../config/routes';
import { ConnectAppRouter } from './ConnectAppRouter';

interface ConnectAppProps {
  projects: Project[];
  platforms: Platform[];
  psqlSessionId: string;
  projectCreationForbidden: boolean;
  psqlConnectHost: string;
  appVersion: string;
}

export const ConnectApp = ({
  projects,
  platforms,
  psqlSessionId,
  projectCreationForbidden,
  psqlConnectHost,
  appVersion,
}: ConnectAppProps) => (
  <MemoryRouter initialEntries={[PsqlConnectRoutes.List]}>
    <AppProvider
      appVersion={appVersion}
      pgSettings={[]}
      psqlConnectHost={psqlConnectHost}
      consoleSettings={{
        projectCreationForbidden,
      }}
    >
      <ActionCableProvider>
        <ConfirmationProvider>
          <PlatformsProvider platforms={platforms}>
            <CurrentUserProvider>
              <ConnectAppProvider
                projects={projects}
                psqlSessionId={psqlSessionId}
              >
                <ConnectAppRouter />
              </ConnectAppProvider>
            </CurrentUserProvider>
          </PlatformsProvider>
        </ConfirmationProvider>
      </ActionCableProvider>
    </AppProvider>
  </MemoryRouter>
);
