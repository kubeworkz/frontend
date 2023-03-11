import React, { PropsWithChildren } from 'react';
import { Form } from '../../components/Form/Form';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FeedbackFormData,
  useHubspot,
} from '../../utils/hubspot';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { FormCallbacks } from '../../components/Form/types';
import { useCurrentUserInfoSafe } from '../../hooks/currentUser';

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
