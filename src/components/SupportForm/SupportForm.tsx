import React, { PropsWithChildren } from 'react';
import { Form } from '../../components/Form/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { useCurrentUserInfoSafe } from '../../hooks/currentUser';
import {
  SupportFormData,
  useHubspot,
} from '../../utils/hubspot';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { FormCallbacks } from '../../components/Form/types';

export interface SupportFormProps extends FormCallbacks<void> {
  id?: string;
  initialData?: Partial<SupportFormData>;
}

export const SupportForm = ({
  id, onSuccess, onFail, initialData, children,
}: PropsWithChildren<SupportFormProps>) => {
  const { trackUiInteraction } = useAnalytics();
  const { email } = useCurrentUserInfoSafe();

  const { submitSupportForm } = useHubspot();
  const form = useForm<SupportFormData>({
    defaultValues: {
      subject: initialData?.subject || '',
      content: initialData?.content || '',
      email: email || initialData?.email || '',
    },
    shouldUnregister: true,
  });

  const onSubmit = (data: SupportFormData) => {
    trackUiInteraction(AnalyticsAction.SupportFormSubmitted);
    return submitSupportForm(data).then(() => {
      if (onSuccess) {
        onSuccess();
      }
    }).catch(() => {
      if (onFail) {
        onFail();
      }
    });
  };

  return (
    <FormProvider {...form}>
      <Form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </Form>
    </FormProvider>
  );
};
