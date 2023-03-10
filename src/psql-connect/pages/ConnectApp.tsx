import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Project } from '#api_client/publicv2';
import { CurrentUserProvider } from '#shared/hooks/currentUser';
import { Platform, PlatformsProvider } from '#shared/hooks/platforms';
import { ConfirmationProvider } from '#shared/components/Confirmation/ConfirmationProvider';
import { ActionCableProvider } from '#shared/hooks/actionCable';
import { AppProvider } from '../../console/hooks/app';
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
