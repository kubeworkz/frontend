import React from 'react';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '../../components/Modal/ModalForm/ModalForm';
import { ModalProps } from '../../components/Modal/Modal';
import { apiErrorToaster } from '../../api/utils';
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
