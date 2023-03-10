import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';

export const NewInvite = React.memo(() => {
  const { register } = useFormContext();

  return (
    <>
      <FormField id="prefix">
        <FormLabel>
          Invite prefix:
        </FormLabel>
        <FormInput {...register('prefix')} />
      </FormField>
      <FormField id="how_many_invites">
        <FormLabel>
          How many invites:
        </FormLabel>
        <FormInput {...register('how_many_invites', { valueAsNumber: true })} />
      </FormField>
      <FormField id="total_registrations">
        <FormLabel>
          Usage limit per invite:
        </FormLabel>
        <FormInput {...register('total_registrations', { valueAsNumber: true })} />
      </FormField>
    </>
  );
});

NewInvite.displayName = 'NewInvite';
