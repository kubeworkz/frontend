import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { Form } from '#shared/components/Form/Form';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '#shared/components/Modal/ModalForm/ModalForm';

const MAX_LEN = 100;

export type QuerySaveDialogProps = {
  isOpen: boolean;
  proposedName: string;
  onClose: () => void;
  onSaveQuery: (name: string) => void;
};
export const QuerySaveDialog = ({
  isOpen,
  proposedName,
  onClose,
  onSaveQuery,
}: QuerySaveDialogProps) => {
  const form = useForm({
    defaultValues: { name: proposedName },
  });
  const { handleSubmit, register, formState } = form;
  const { trackUiInteraction } = useAnalytics();

  return (
    <ModalForm
      isOpen={isOpen}
      onRequestClose={onClose}
      title="Save query"
    >
      <FormProvider {...form}>
        <Form
          id="query-save-form"
          onSubmit={handleSubmit((data) => {
            trackUiInteraction(AnalyticsAction.PlaygroundSave);
            return onSaveQuery(data.name);
          })}
        >
          <ModalFormBody>
            <FormField
              id="name"
              error={formState.errors?.name?.message}
              inline
              label="Name"
            >
              <FormInput
                autoFocus
                {...register('name', {
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                  maxLength: {
                    value: MAX_LEN,
                    message: `Query name should be less than ${MAX_LEN} characters`,
                  },
                })}
              />
            </FormField>
          </ModalFormBody>
          <ModalFormActions>
            <ModalFormCancelButton />
            <ModalFormSubmitButton>
              Save
            </ModalFormSubmitButton>
          </ModalFormActions>
        </Form>
      </FormProvider>
    </ModalForm>
  );
};
