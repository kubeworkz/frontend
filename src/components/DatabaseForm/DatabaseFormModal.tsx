import React from 'react';
import { Button } from '../../components/Button/Button';
import classNames from 'classnames';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '../../components/Modal/ModalForm/ModalForm';
import { apiErrorToaster } from '../../api/utils';
import { ModalProps } from '../../components/Modal/Modal';
import { withDisableOnTransition } from '../withDisableOnTransition/withDisableOnTransition';
import { DatabaseFormFields } from './DatabaseFormFields';
import { DatabaseFormProps, DatabaseFormProvider } from './DatabaseFormProvider';

import styles from './DatabaseForm.module.css';

const TransitionButton = withDisableOnTransition(Button);

interface DatabaseFormModalProps extends
  ModalProps {
  formProps?: Omit<DatabaseFormProps, 'id'>,
}

export const DatabaseFormModal = ({
  formProps = {}, className, ...props
}: DatabaseFormModalProps) => (
  <ModalForm
    title="Database creation"
    className={classNames(className, styles.modal)}
    {...props}
  >
    <DatabaseFormProvider
      database={formProps.database}
      onSuccess={formProps.onSuccess}
      onFail={apiErrorToaster}
    >
      <ModalFormBody>
        <DatabaseFormFields />
      </ModalFormBody>
      <ModalFormActions>
        <ModalFormCancelButton />
        <ModalFormSubmitButton
          data-qa="create_database_form_submit"
          as={TransitionButton}
        >
          Create
        </ModalFormSubmitButton>
      </ModalFormActions>
    </DatabaseFormProvider>
  </ModalForm>
);
