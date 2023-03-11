import React from 'react';
import { Modal } from '../../components/Modal/Modal';
import ReactModal from 'react-modal';
import { ModalBody } from '../../components/Modal/ModalBody';
import { ModalActions } from '../../components/Modal/ModalActions';
import { Button } from '../../components/Button/Button';
import classNames from 'classnames';
import { RoleForm } from './RoleForm';
import { RoleFormProps, RoleFormProvider } from './RoleFormProvider';

import styles from './RoleForm.module.css';

interface RoleFormModalProps extends
  RoleFormProps,
  ReactModal.Props {}

export const RoleFormModal = ({
  initialRole, onError, onSuccess, className, ...props
}: RoleFormModalProps) => (
  <Modal
    title="Role creation"
    className={classNames(className, styles.modal)}
    {...props}
  >
    <RoleFormProvider
      initialRole={initialRole}
      onSuccess={(r) => {
        if (onSuccess) {
          onSuccess(r);
        }
        if (props.onRequestClose) {
          // @ts-ignore
          props.onRequestClose();
        }
      }}
      onError={onError}
    >
      <ModalBody>
        <RoleForm />
      </ModalBody>
      <ModalActions>
        <Button
          type="submit"
        >
          Create
        </Button>
      </ModalActions>
    </RoleFormProvider>
  </Modal>
);
