import React from 'react';
import { useCurrentUser } from '../../hooks/currentUser';
import { SettingsDesc, SettingsHeader } from '../../components/Settings/Settings';
import { FormLabel } from '../../components/Form/FormLabel/FormLabel';
import { FormInput } from '../../components/Form/FormInput/FormInput';

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
