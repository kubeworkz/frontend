import React, { useMemo } from 'react';
import { useLocation } from 'react-router';

import { SvgIcon } from '../../components/SvgIcon/SvgIcon';
import { SettingsDesc, SettingsPageHeader } from '../../components/Settings/Settings';
import { Role } from '../../api/publicv2';

import { Button } from '../../components/Button/Button';
import { RolePassword } from '../RolePassword/RolePassword';
import styles from './Success.module.css';

type SuccessProps = {
  vercelProject: string;
  cloudrockProject: string;
  roleWithPassword?: Role;
};

export const Success = ({ vercelProject, cloudrockProject, roleWithPassword }: SuccessProps) => {
  const { search } = useLocation();
  const redirectUrl = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get('next');
  }, [search]);

  return (
    <div className={styles.root}>
      <SvgIcon name="success_50" className={styles.icon} />
      <SettingsPageHeader>Success!</SettingsPageHeader>
      <SettingsDesc>
        Vercel project
        {' '}
        <strong>{vercelProject}</strong>
        {' '}
        and Neon project
        {' '}
        <strong>{cloudrockProject}</strong>
        {' '}
        are now connected.
      </SettingsDesc>
      {roleWithPassword && (
      <RolePassword roleWithPassword={roleWithPassword} />
      )}
      {redirectUrl && (
        <Button as="a" appearance="primary" size="l" href={redirectUrl}>
          Done
        </Button>
      )}
    </div>
  );
};
