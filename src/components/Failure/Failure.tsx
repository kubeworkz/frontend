import React from 'react';

import { Alert } from '../../components/Alert/Alert';
import {
  SettingsDesc,
  SettingsHeader,
} from '../../components/Settings/Settings';

import { Role } from '../../api/publicv2';
import { SvgIcon } from '../../components/SvgIcon/SvgIcon';
import { Button } from '../../components/Button/Button';
import { HelpBlock } from '../../components/HelpBlock/HelpBlock';

import { Divider } from '../../components/Divider/Divider';
import { RolePassword } from '../RolePassword/RolePassword';
import { ExternalProject } from '../../types';
import styles from './Failure.module.css';

export type FailureProps = {
  error: string;
  errorCode: string;
  vercelProject: ExternalProject;
  cloudrockProject: string;
  roleWithPassword?: Role;
  onRestart: () => void;
};

export const Failure = ({
  error,
  errorCode,
  cloudrockProject,
  vercelProject,
  roleWithPassword,
  onRestart,
}: FailureProps) => (
  <div className={styles.root}>
    <SvgIcon className={styles.icon} name="fail_50" />
    <SettingsHeader>Connection failed</SettingsHeader>
    <SettingsDesc>
      There was a problem connecting Vercel project
      {' '}
      <strong>{vercelProject.name}</strong>
      {' '}
      and Cloudrock project
      {' '}
      <strong>{cloudrockProject}</strong>
    </SettingsDesc>
    <Alert appearance="error">
      {errorCode === 'VERCEL_ENV_VARS_EXIST' ? (
        <span>
          Environment variables set by this integration already exist. Remove
          the variables from the
          {' '}
          <Button
            className={styles.errorLink}
            appearance="default"
            as="a"
            target="_blank"
            href={vercelProject.settingsEnvsLink}
          >
            Vercel project settings
          </Button>
          {' '}
          and retry the connection.
        </span>
      ) : (
        error
      )}
    </Alert>
    {roleWithPassword && (
      <>
        <br />
        <RolePassword roleWithPassword={roleWithPassword} />
      </>
    )}
    <Button appearance="primary" className={styles.button} onClick={onRestart}>
      Retry connection
    </Button>
    <Divider width="short" className={styles.divider} />
    <HelpBlock className={styles.help}>
      For information about resolving connection issues, see
      {' '}
      <Button
        appearance="default"
        size="s"
        as="a"
        href="https://cloudrock.ca/docs/guides/vercel#troubleshoot-connection-issues"
        target="_blank"
      >
        Troubleshoot connection issues.
      </Button>
    </HelpBlock>
  </div>
);
