import React from 'react';

export interface Settings {
  projectCreationForbidden: boolean;
}

const context = React.createContext<Settings | null>(null);
context.displayName = 'Settings';

export const SettingsProvider = context.Provider;

export const useSettings = () => {
  const settings = React.useContext(context);
  if (!settings) {
    throw new Error('SettingsProvider not found');
  }

  const flags = React.useMemo(() => ({
    projectCreationForbidden: settings.projectCreationForbidden,
  }), [settings.projectCreationForbidden]);

  return {
    settings,
    flags,
  };
};
