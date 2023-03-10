import React from 'react';
import { ModalProps } from '#shared/components/Modal/Modal';
import { FeedbackFormFields } from '#shared/components/FeedbackForm/FeedbackFormFields';
import { FeedbackForm } from '#shared/components/FeedbackForm/FeedbackForm';
import { toast } from 'react-toastify';
import { ToastError, ToastSuccess } from '#shared/components/Toast/Toast';
import { AnyLink } from '#shared/components/AnyLink/AnyLink';
import { HUBSPOT_ERROR_TOAST_OPTIONS } from '#shared/utils/hubspot';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '#shared/components/Modal/ModalForm/ModalForm';

interface FeedbackFormModalProps extends ModalProps {}

export const FeedbackFormModal = (props: FeedbackFormModalProps) => (
  <ModalForm
    title="Submit feedback"
    {...props}
  >
    <FeedbackForm
      onSuccess={() => {
        toast(<ToastSuccess body="Thanks for your feedback!" />);
        // @ts-ignore
        props.onRequestClose();
      }}
      onFail={() => {
        toast(
          <ToastError body={(
            <>
              Request failed. Please try again or contact us at
              {' '}
              <AnyLink
                as="a"
                href="mailto:feedback@cloudrock.ca"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
              >
                feedback@cloudrock.ca
              </AnyLink>
              .
            </>
          )}
          />,
          {
            ...HUBSPOT_ERROR_TOAST_OPTIONS,
            toastId: 'feedback_form_failed',
          },
        );
      }}
    >
      <ModalFormBody>
        <FeedbackFormFields />
      </ModalFormBody>
      <ModalFormActions>
        <ModalFormCancelButton />
        <ModalFormSubmitButton>
          Send
        </ModalFormSubmitButton>
      </ModalFormActions>
    </FeedbackForm>
  </ModalForm>
);
