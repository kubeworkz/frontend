import React from 'react';
import { useCurrentUser } from '#shared/hooks/currentUser';
import { SettingsDesc, SettingsHeader } from '#shared/components/Settings/Settings';
import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';

export const UserSettingsName = () => {
  const { user } = useCurrentUser();

  return (
    <>
      <SettingsHeader>
        Personal information
      </SettingsHeader>
      <SettingsDesc>
        <FormLabel>User name:</FormLabel>
        <FormInput
          value={user.name}
          disabled
        />
      </SettingsDesc>
      <SettingsDesc>
        <FormLabel>Email:</FormLabel>
        <FormInput
          value={user.email}
          disabled
        />
      </SettingsDesc>
    </>
  );
};
