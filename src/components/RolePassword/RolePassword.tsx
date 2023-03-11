import React from 'react';

import { Role } from '../../api/publicv2';
import { Text } from '../../components/Text/Text';
import { CopyButton } from '../../components/CopyButton/CopyButton';

import styles from './RolePassword.module.css';

export type RolePasswordProps = {
  roleWithPassword: Role;
};
export const RolePassword = ({ roleWithPassword }: RolePasswordProps) => (
  <div className={styles.root}>
    The password for
    {' '}
    {roleWithPassword.name}
    {' '}
    on the
    {' '}
    <b>primary</b>
    {' '}
    branch of the Neon project was reset.
    Save the password. You won&apos;t see it again:
    <br />
    <Text appearance="default" className={styles.password}>{roleWithPassword.password}</Text>
    <CopyButton text={roleWithPassword.password ?? ''} />
  </div>
);
