import React from 'react';
import { Modal } from '../../components/Modal/Modal';
import { Button } from '../../components/Button/Button';
import { Appearance, AppearanceProps } from '../../types/Props';
import { ModalBody } from '../../components/Modal/ModalBody';
import { ModalActions } from '../../components/Modal/ModalActions';

import styles from './Confirmation.module.css';

export interface ConfirmationProps extends AppearanceProps<Appearance | 'error' | 'success' | 'warning'> {
  onConfirm?(): void;
  onClose(): void;
  header?: string;
  text?: React.ReactNode;
  confirmButtonText?: string;
  declineButtonText?: string;
}

export const Confirmation = (
  {
    onClose,
    onConfirm,
    header,
    text,
    confirmButtonText = 'Ok',
    declineButtonText = 'Cancel',
    appearance = 'primary',
  }: ConfirmationProps,
) => (
  <Modal
    isOpen
    className={styles.root}
    onRequestClose={onClose}
    data-qa="confirmation_modal"
  >
    <ModalBody>
      <div className={styles.header}>
        {header}
      </div>
      {text}
    </ModalBody>
    <ModalActions>
      <Button
        data-qa="confirmation-cancel"
        appearance="default"
        onClick={onClose}
      >
        {declineButtonText}
      </Button>
      <Button
        appearance={appearance}
        onClick={() => {
          if (onConfirm) {
            onConfirm();
          }
          onClose();
        }}
        data-qa="confirmation_confirm_button"
      >
        {confirmButtonText}
      </Button>
    </ModalActions>
  </Modal>
);
