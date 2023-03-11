import React from 'react';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '../../components/Modal/ModalForm/ModalForm';
import { ModalProps } from '../../components/Modal/Modal';
import { FormCallbacks } from '../../components/Form/types';
import { SupportForm, SupportFormProps } from '../../components/SupportForm/SupportForm';
import { SupportFormFields } from '../../components/SupportForm/SupportFormFields';
import { toast } from 'react-toastify';
import { ToastError, ToastSuccess } from '../../components/Toast/Toast';
import { AnyLink } from '../../components/AnyLink/AnyLink';
import { EMAIL_SUPPORT } from '../../config/config';
import { HUBSPOT_ERROR_TOAST_OPTIONS } from '../../utils/hubspot';

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
