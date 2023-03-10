import React from 'react';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '#shared/components/Modal/ModalForm/ModalForm';
import { ModalProps } from '#shared/components/Modal/Modal';
import { apiErrorToaster } from '#api_client/utils';
import { EndpointEditFormProps, EndpointShortForm } from './EndpointShortForm';
import {
  EndpointCreateShortFormFields,
  EndpointEditShortFormFields,
} from './EndpointShortFormFields';

interface EndpointFormModalProps extends ModalProps {
  formProps: EndpointEditFormProps;
}

export const EndpointFormModal = ({
  formProps,
  ...props
}: EndpointFormModalProps) => (
  <ModalForm
    title={formProps.endpoint ? `Edit compute endpoint ${formProps.endpoint.id}` : 'Create compute endpoint'}
    {...props}
  >
    <EndpointShortForm
      {...formProps}
      onFail={apiErrorToaster}
    >
      <ModalFormBody>
        {
          formProps.endpoint
            ? <EndpointEditShortFormFields endpoint={formProps.endpoint} />
            : <EndpointCreateShortFormFields />
        }
      </ModalFormBody>
      <ModalFormActions>
        <ModalFormCancelButton />
        <ModalFormSubmitButton>
          {formProps.endpoint ? 'Save' : 'Create'}
        </ModalFormSubmitButton>
      </ModalFormActions>
    </EndpointShortForm>
  </ModalForm>
);
