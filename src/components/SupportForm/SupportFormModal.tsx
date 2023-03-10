import React from 'react';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '#shared/components/Modal/ModalForm/ModalForm';
import { ModalProps } from '#shared/components/Modal/Modal';
import { FormCallbacks } from '#shared/components/Form/types';
import { SupportForm, SupportFormProps } from '#shared/components/SupportForm/SupportForm';
import { SupportFormFields } from '#shared/components/SupportForm/SupportFormFields';
import { toast } from 'react-toastify';
import { ToastError, ToastSuccess } from '#shared/components/Toast/Toast';
import { AnyLink } from '#shared/components/AnyLink/AnyLink';
import { EMAIL_SUPPORT } from '#shared/config';
import { HUBSPOT_ERROR_TOAST_OPTIONS } from '#shared/utils/hubspot';

interface SupportFormModalProps extends ModalProps {
  formProps?: Omit<SupportFormProps, keyof FormCallbacks<any>>;
}

export const SupportFormModal = ({ formProps = {}, ...modalProps }: SupportFormModalProps) => (
  <ModalForm
    title="Create ticket for support"
    {...modalProps}
  >
    <SupportForm
      {...formProps}
      onSuccess={() => {
        toast(<ToastSuccess body="Thanks for your feedback!" />);
        // @ts-ignore
        modalProps.onRequestClose();
      }}
      onFail={() => (
        toast(
          <ToastError body={(
            <>
              Request failed. Please try again or contact us at
              {' '}
              <AnyLink
                as="a"
                href={`mailto:${EMAIL_SUPPORT}`}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
              >
                {EMAIL_SUPPORT}
              </AnyLink>
              .
            </>
          )}
          />,
          {
            ...HUBSPOT_ERROR_TOAST_OPTIONS,
            toastId: 'support_form_failed',
          },
        )
      )}
    >
      <ModalFormBody>
        <SupportFormFields />
      </ModalFormBody>
      <ModalFormActions>
        <ModalFormCancelButton />
        <ModalFormSubmitButton>
          Send
        </ModalFormSubmitButton>
      </ModalFormActions>
    </SupportForm>
  </ModalForm>
);
