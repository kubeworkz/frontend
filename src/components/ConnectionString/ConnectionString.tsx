import React from 'react';
import { CONN_DATA_PLACEHOLDER } from '#shared/utils/connectionString';
import { HiddenPassword } from '#shared/components/HiddenPassword/HiddenPassword';

interface GetConnectionStringOptions {
  user?: string;
  password?: string;
  passwordLoading?: boolean;
  database?: string;
  host: string;
}

export const ConnectionString = ({
  user, database, password, host, passwordLoading,
}: GetConnectionStringOptions) => {
  const encodedRole = user ? encodeURIComponent(user) : CONN_DATA_PLACEHOLDER.role;
  const encodedDb = database
    ? encodeURIComponent(database)
    : CONN_DATA_PLACEHOLDER.database;

  return (
    <>
      postgres://
      {encodedRole}
      {password || passwordLoading
        ? (
          <>
            :
            <HiddenPassword
              key={`password-${host}-${user}`}
              value={password}
              loading={passwordLoading}
            />
          </>
        )
        : ''}
      @
      {host}
      /
      {encodedDb}
    </>
  );
};
