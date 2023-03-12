/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-default-export */
import { capitalize } from 'lodash';
import React from 'react';
import { StaticRouter, Switch } from 'react-router-dom';

import { CSRFProvider } from '../../hooks/csrf';

import { useBrowserDetect } from '../../hooks/browserDetect';
import { getCSRFToken } from '../../utils/getCSRFToken';
import { Text } from '../../components/Text/Text';
import { TrackingRoute } from '../../utils/analytics';
import { AuthRoutes } from '../../routes/routes';
import { AuthLayout } from '../AuthLayout/AuthLayout';
import { EnterInvite } from './SignInForm/EnterInvite';
import { SignInForm } from './SignInForm/SignInForm';

interface PsqlSessionSignInProps {
  sessionId: string;
}
export const PsqlSessionSignIn = ({
  sessionId,
}: PsqlSessionSignInProps) => (
  <SignInForm
    psql_session_id={sessionId}
    description={(
      <>
        <Text as="p">We are about to create a database @dbname for you.</Text>
        <Text as="p">
          Please sign in, so we can associate this database with you.
        </Text>
        <br />
      </>
    )}
  />
);

interface SignInProps {
  psql_session_id?: string;
  error?: string;
  login?: string;
  clientId?: string;
}

const SignIn = (props: SignInProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    psql_session_id,
    error,
    login,
  } = props;
  useBrowserDetect();

  return (
    <CSRFProvider token={getCSRFToken()}>
      <StaticRouter
        location={window.location.pathname + window.location.search}
      >
        <Switch>
          <AuthLayout error={error}>
            <TrackingRoute
              path={AuthRoutes.EnterInvite}
              component={() => {
                if (!login) {
                  return null;
                }
                return <EnterInvite login={login} />;
              }}
            />
            <TrackingRoute
              path={AuthRoutes.PsqlSession}
              component={
                () => {
                  if (!psql_session_id) {
                    return null;
                  }
                  return (
                    <PsqlSessionSignIn
                      sessionId={psql_session_id}
                    />
                  );
                }
              }
            />
            <TrackingRoute
              path={AuthRoutes.SignInMain}
              component={() => <SignInForm {...props} />}
            />
            <TrackingRoute
              path={AuthRoutes.SignInOauth}
              component={() => (
                <SignInForm
                  {...(props.clientId
                    ? {
                      description: `Log in to Cloudrock to continue to ${capitalize(
                        props.clientId,
                      )}`,
                    }
                    : {})}
                  {...props}
                />
              )}
            />
          </AuthLayout>
        </Switch>
      </StaticRouter>
    </CSRFProvider>
  );
};

export default SignIn;
