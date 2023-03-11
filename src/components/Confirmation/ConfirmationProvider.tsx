import React, { createContext, PropsWithChildren } from 'react';
import { Confirmation, ConfirmationProps } from '../../components/Confirmation/Confirmation';
import { Database, Project, Role } from '../../api/generated/api';
import { Alert } from '../../components/Alert/Alert';
import { Branch, Endpoint } from '../../api/publicv2';
import { createUseContext } from '../../hooks/utils';

export type ConfirmationOptions = Omit<ConfirmationProps, 'onConfirm' | 'onClose'> | ((...args: any) => Omit<ConfirmationProps, 'onConfirm' | 'onClose'>);

export enum ConfirmationPreset {
  DeleteProject = 'deleteProject',
  DeleteRole = 'deleteRole',
  DeleteDatabase = 'deleteDatabase',
  ResetQuery = 'resetQuery',
  DeleteBranch = 'deleteBranch',
  DeleteEndpoint = 'deleteEndpoint',
  RevokeIntegration = 'revokeIntegration',
  RevokeProjectPermission = 'revokeProjectPermission',
}

interface ConfirmationContextInterface {
  confirm(opts: ConfirmationOptions | ConfirmationPreset): Promise<unknown>;
}

const ConfirmationContext = createContext<ConfirmationContextInterface | null>(null);
ConfirmationContext.displayName = 'ConfirmationContext';

const useConfirmation = createUseContext(ConfirmationContext);

const ConfirmationPresetOptions: Record<ConfirmationPreset, ConfirmationOptions> = {
  [ConfirmationPreset.DeleteProject]: (project: Project) => ({
    header: 'Do you want to delete this project?',
    text: (
      <Alert appearance="error">
        This action cannot be undone. This will permanently delete the project
        {' '}
        <b>{project.name}</b>
      </Alert>
    ),
    confirmButtonText: 'Delete',
    appearance: 'error',
  }),
  [ConfirmationPreset.DeleteRole]: (role: Role) => ({
    header: 'Do you want to delete this role?',
    text: (
      <Alert appearance="error">
        This action cannot be undone. This will permanently delete the role
        {' '}
        <b>{role.name}</b>
      </Alert>
    ),
    confirmButtonText: 'Delete',
    appearance: 'error',
  }),
  [ConfirmationPreset.DeleteDatabase]: (db: Database) => ({
    header: 'Do you want to delete this database?',
    text: (
      <Alert appearance="error">
        This action cannot be undone. This will permanently delete the database
        {' '}
        <b>{db.name}</b>
      </Alert>
    ),
    confirmButtonText: 'Delete',
    appearance: 'error',
  }),
  [ConfirmationPreset.ResetQuery]: () => ({
    header: 'Do you want to reset the query?',
    text: (
      <Alert appearance="warning">
        You are going to loose all unsaved chages. Continue?
      </Alert>
    ),
    appearance: 'primary',
    confirmButtonText: 'OK',
    declineButtonText: 'Cancel',
  }),
  [ConfirmationPreset.DeleteBranch]: (branch: Branch) => ({
    header: 'Delete the branch?',
    text: (
      <Alert appearance="error">
        This will permanently delete the branch
        {' '}
        <b>{branch.name}</b>
        . Are you sure you want proceed?
        {' '}
      </Alert>
    ),
    confirmButtonText: 'Delete',
    appearance: 'error',
  }),
  [ConfirmationPreset.DeleteEndpoint]: (endpoint: Endpoint) => ({
    header: 'Delete the compute endpoint?',
    text: (
      <Alert appearance="error">
        This will permanently delete the compute endpoint
        {' '}
        <b>{endpoint.id}</b>
        . Are you sure you want proceed?
        {' '}
      </Alert>
    ),
    confirmButtonText: 'Delete',
    appearance: 'error',
  }),
  [ConfirmationPreset.RevokeIntegration]: () => ({
    header: 'Revoke the integration?',
    text: (
      <Alert appearance="error">
        This will permanently unlink the Neon database from the integration.
        Are you sure you want proceed?
      </Alert>
    ),
    confirmButtonText: 'Revoke',
    appearance: 'error',
  }),
  [ConfirmationPreset.RevokeProjectPermission]: () => ({
    header: 'Revoke the access?',
    text: (
      <Alert appearance="error">
        The user will immediately lose access to the project.
        Are you sure you want proceed?
      </Alert>
    ),
    confirmButtonText: 'Revoke',
    appearance: 'error',
  }),
};

export const createConfirmation = (preset: ConfirmationPreset, ...args: any) => {
  const confirmationOptions = ConfirmationPresetOptions[preset];
  if (typeof confirmationOptions === 'function') {
    return confirmationOptions(...args);
  }
  return confirmationOptions;
};

const ConfirmationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [options, setOptions] = React.useState<ConfirmationOptions | null>();
  const awaitingPromiseRef = React.useRef<{
    resolve:(v?: unknown) => void;
    reject: () => void;
  }>();

  const confirm = (o: ConfirmationOptions | ConfirmationPreset) => {
    setOptions(typeof o === 'string' ? ConfirmationPresetOptions[o] : o);
    return new Promise((res, rej) => {
      awaitingPromiseRef.current = {
        resolve: res,
        reject: rej,
      };
    });
  };

  const handleSubmit = () => {
    awaitingPromiseRef.current?.resolve();
    setOptions(null);
  };

  const handleCancel = () => {
    awaitingPromiseRef.current?.reject();
    setOptions(null);
  };

  return (
    <ConfirmationContext.Provider value={{
      confirm,
    }}
    >
      {options
        && (
        <Confirmation
          {...options}
          onClose={handleCancel}
          onConfirm={handleSubmit}
        />
        )}
      {children}
    </ConfirmationContext.Provider>
  );
};

export { ConfirmationProvider, useConfirmation };
