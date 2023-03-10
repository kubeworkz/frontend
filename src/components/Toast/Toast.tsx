import React from 'react';
import { Alert } from '#shared/components/Alert/Alert';
import { AppearanceProps, AppearanceStatus } from '#shared/types/Props';

export interface ToastProps extends AppearanceProps<AppearanceStatus> {
  header?: React.ReactNode;
  body?: React.ReactNode;
  closeToast?(): void;
}

const Toast = ({
  header, body = 'Something went wrong', appearance, closeToast,
}: ToastProps) => (
  <Alert
    appearance={appearance}
    onClose={closeToast}
  >
    {header || body}
  </Alert>
);

export const ToastSuccess = (props: ToastProps) => (
  <Toast
    {...props}
    appearance="success"
  />
);

export const ToastError = (props: ToastProps) => (
  <Toast
    {...props}
    appearance="error"
  />
);
