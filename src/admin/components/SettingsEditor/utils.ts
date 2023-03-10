export const settingsToJSON = (settings: object | any) => (
  settings ? JSON.stringify(settings, null, '  ') : ''
);
