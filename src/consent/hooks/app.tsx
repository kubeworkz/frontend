import React, {
  createContext, PropsWithChildren,
} from 'react';
import { CurrentUserInfoResponse } from '#api_client/publicv2';
import { createUseContext } from '#shared/hooks/utils';
import { PgSettingInternal, PgSettingsProvider } from '#shared/hooks/pgSettings';
import { Settings, SettingsProvider } from '#shared/hooks/settings';
import { PasswordStorageProvider } from '#shared/hooks/passwordStorage';
import { AppCacheProvider } from './cache';

export type FeatureName = 'usageConsumption' | 'branching' | 'computeInsights' | 'integrations' | 'regions' | 'autoscaling_ui' | 'provisioner_ui' | 'autoscaling_ui_next' | 'syntheticStorageSizeUI' | 'freeTierV2' | 'projectSharingUI' | 'endpointPoolerHiddenUI';

export type ConsoleFeatures = Partial<Record<FeatureName, boolean>>;

interface AppContextInterface {
  appVersion: string;
  psqlConnectHost: string;
  isFeatureEnabled(f: FeatureName): boolean;
}

export type ConsoleUser = Omit<CurrentUserInfoResponse, 'id' | 'name' | 'email' | 'image'> & Partial<Omit<CurrentUserInfoResponse, 'projects_limit' | 'auth_accounts'>>;

export interface AppProviderProps {
  consoleSettings: Settings;
  pgSettings: PgSettingInternal[];
  features?: ConsoleFeatures;
  appVersion: string;
  psqlConnectHost: string;
}

export const AppContext = createContext<AppContextInterface | null>(null);
AppContext.displayName = 'AppContext';

const useAppContext = createUseContext(AppContext);

const AppProvider = ({
  children,
  pgSettings,
  consoleSettings,
  features = {},
  appVersion,
  psqlConnectHost,
}: PropsWithChildren<AppProviderProps>) => {
  const isFeatureEnabled = (featureName: FeatureName) => !!features[featureName];

  return (
    <AppCacheProvider>
      <AppContext.Provider value={{
        isFeatureEnabled,
        appVersion,
        psqlConnectHost,
      }}
      >
        <SettingsProvider value={consoleSettings}>
          <PgSettingsProvider value={{ pgSettings }}>
            <PasswordStorageProvider>
              {children}
            </PasswordStorageProvider>
          </PgSettingsProvider>
        </SettingsProvider>
      </AppContext.Provider>
    </AppCacheProvider>
  );
};

export { AppProvider, useAppContext };
