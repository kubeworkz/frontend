import React, { PropsWithChildren } from 'react';
import { Form } from '#shared/components/Form/Form';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FeedbackFormData,
  useHubspot,
} from '#shared/utils/hubspot';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { FormCallbacks } from '#shared/components/Form/types';
import { useCurrentUserInfoSafe } from '#shared/hooks/currentUser';

export interface FeedbackFormProps extends FormCallbacks<void> {
}

export const FeedbackForm = ({
  onSuccess,
  onFail,
  children,
}: PropsWithChildren<FeedbackFormProps>) => {
  const { trackUiInteraction } = useAnalytics();
  const { email } = useCurrentUserInfoSafe();

  const { submitFeedbackForm } = useHubspot();

  const form = useForm<FeedbackFormData>({
    defaultValues: {
      message: '',
      email,
    },
    shouldUnregister: true,
  });

  const onSubmit = (data: FeedbackFormData) => {
    trackUiInteraction(AnalyticsAction.FeedbackFormSubmitted);
    return submitFeedbackForm(data).then(() => {
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
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </Form>
    </FormProvider>
  );
};
