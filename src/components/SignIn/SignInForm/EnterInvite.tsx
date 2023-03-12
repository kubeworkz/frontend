import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router';

import { logoutViaCookie } from '../../../api/utils';
import { Button } from '../../../components/Button/Button';
import { Form } from '../../../components/Form/Form';
import { FormFieldset } from '../../../components/Form/FormFieldset/FormFieldset';
import { FormInput } from '../../../components/Form/FormInput/FormInput';
import { FormField } from '../../../components/Form/FormField/FormField';
import { useCSRFContext } from '../../../hooks/csrf';
import { Text } from '../../../components/Text/Text';

import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import styles from './SignInForm.module.css';

export type EnterInviteProps = {
  login: string;
};

export const EnterInvite = ({ login }: EnterInviteProps) => {
  const [error, setError] = useState('');
  const { trackUiInteraction } = useAnalytics();
  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    const { invite } = event.currentTarget;
    const inviteValue = invite.value.trim();
    if (inviteValue.length === 0) {
      setError('Invite code is required');
      event.preventDefault();
    } else {
      trackUiInteraction(AnalyticsAction.InviteCodeSubmitted, {
        invite: inviteValue,
      });
    }
  }, []);
  const { search } = useLocation();
  const inviteCodeFromUrl = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return searchParams.get('invite') || '';
  }, [search]);

  const onClickSignOut = () => {
    trackUiInteraction(AnalyticsAction.InactiveUserLoggedOut);
    logoutViaCookie();
  };

  return (
    <Form
      action="/enter_invite"
      method="post"
      onSubmit={onSubmit}
      acceptCharset="utf-8"
    >
      <input
        type="hidden"
        name="authenticity_token"
        value={useCSRFContext().token}
      />
      <FormFieldset
        title={`Hey, ${login}`}
      >
        <Text>Use invitation code to get access to a Cloudrock beta</Text>
        <br />
        <FormField id="invite" error={error}>
          <FormInput defaultValue={inviteCodeFromUrl} type="text" placeholder="invite code" name="invite" />
        </FormField>
      </FormFieldset>
      <div className={styles.actionsInvite}>
        <Button
          type="submit"
        >
          OK
        </Button>
        <Button
          appearance="default"
          type="button"
          onClick={onClickSignOut}
        >
          Sign Out
        </Button>
      </div>
    </Form>
  );
};
