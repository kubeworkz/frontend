import React, { PropsWithChildren } from 'react';
import { Form } from '../../components/Form/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { ApiKeyCreateRequest, ApiKeyCreateResponse, apiService } from '../../api/publicv2';
import { FormCallbacks } from '../../components/Form/types';

interface ApiKeyFormProps extends FormCallbacks<ApiKeyCreateResponse> {}

export const ApiKeyForm = ({
  onSuccess, onFail, children, ...props
}: PropsWithChildren<ApiKeyFormProps>) => {
  const form = useForm();

  const onSubmit = (data: ApiKeyCreateRequest) => apiService
    .createApiKey(data)
    .then(({ data: token }) => {
      if (onSuccess) {
        onSuccess(token);
      }
    }, (err) => {
      if (onFail) {
        onFail(err);
      }
    });

  return (
    <FormProvider {...form}>
      <Form
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </Form>
    </FormProvider>
  );
};
