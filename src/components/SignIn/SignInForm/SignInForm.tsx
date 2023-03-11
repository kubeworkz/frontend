import { partition } from 'lodash';
import React, { ReactNode, useState } from 'react';

import { useCSRFContext } from '../../../hooks/csrf';
import { Button } from '../../../components/Button/Button';
import { Form } from '../../../components/Form/Form';
import { FormFieldset } from '../../../components/Form/FormFieldset/FormFieldset';

import { OrDivider } from '../../../components/OrDivider/OrDivider';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { AuthProvider, AuthProviderDetails, providers } from '../providers';
import styles from './SignInForm.module.css';

type AuthButtonProps = {
  provider: AuthProviderDetails;
  onChangeProvider: (provider: AuthProvider) => void;
};
const AuthButton = ({ provider, onChangeProvider }: AuthButtonProps) => (
  <Button
    type="submit"
    data-qa="auth-button"
    data-provider={provider.id}
    appearance={provider.id}
    className={styles.actionItem}
    icon={provider.icon}
    iconSize={32}
    size="l"
    onClick={() => onChangeProvider(provider.id)}
  >
    Continue with
    {' '}
    {provider.name}
  </Button>
);

interface SignInFormProps {
  psql_session_id?: string;
  description?: ReactNode;
  clientId?: string;
}

export const SignInForm = ({
  psql_session_id,
  description,
  clientId,
}: SignInFormProps) => {
  const { token } = useCSRFContext();
  const { trackUiInteraction } = useAnalytics();
  const providerInputRef = React.useRef<HTMLInputElement>(null);

  const onChangeProvider = React.useCallback((p: AuthProvider) => {
    if (providerInputRef.current) {
      trackUiInteraction(AnalyticsAction.ProviderClicked, { provider: p });
      providerInputRef.current.value = p;
    }
  }, []);

  const [[priorityProvider], otherProviders] = React.useMemo(
    () => partition(
      providers,
      (p) => clientId && clientId.startsWith(p.id),
    ),
    [clientId],
  );

  const [partnerProviders, independentProviders] = React.useMemo(
    () => partition(otherProviders, (p) => p.partner),
    [otherProviders],
  );

  const [view, setView] = useState<'main' | 'partners'>('main');

  return (
    <Form
      className={styles.form}
      action={
        psql_session_id ? `/auth?psql_session_id=${psql_session_id}` : '/auth'
      }
      method="post"
      acceptCharset="utf-8"
      id="new_user"
    >
      <FormFieldset className={styles.title} title="Welcome to Neon">
        <div className={styles.description}>{description}</div>
        <input type="hidden" name="authenticity_token" value={token} />
        <input type="hidden" name="provider" ref={providerInputRef} />
      </FormFieldset>
      <div className={styles.actions}>
        {priorityProvider && (
          <>
            <AuthButton
              provider={priorityProvider}
              onChangeProvider={onChangeProvider}
            />
            <OrDivider className={styles.divider} />
          </>
        )}
        {view === 'main' ? (
          <>
            {independentProviders.map((provider) => (
              <AuthButton
                key={provider.id}
                provider={provider}
                onChangeProvider={onChangeProvider}
              />
            ))}

            {partnerProviders.length > 0 && (
              <Button
                type="button"
                appearance="tertiary"
                size="l"
                className={styles.actionItem}
                onClick={() => setView('partners')}
              >
                Continue with partners
              </Button>
            )}
            {priorityProvider && (
              <div className={styles.separator} />
            )}
          </>
        ) : (
          <>
            {partnerProviders.map((provider) => (
              <AuthButton
                key={provider.id}
                provider={provider}
                onChangeProvider={onChangeProvider}
              />
            ))}
            <OrDivider className={styles.divider} />
            <Button
              appearance="default"
              size="l"
              onClick={() => setView('main')}
            >
              See other sign up options
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};
