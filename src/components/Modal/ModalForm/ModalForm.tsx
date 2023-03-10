import React, { createContext, PropsWithChildren, useContext } from 'react';
import classNames from 'classnames';
import { Modal, ModalProps } from '#shared/components/Modal/Modal';
import { ModalBody, ModalBodyProps } from '#shared/components/Modal/ModalBody';
import { ModalActions } from '#shared/components/Modal/ModalActions';
import { Button, ButtonProps } from '#shared/components/Button/Button';
import { AsProps } from '#shared/types/Props';

import { useFormContext } from 'react-hook-form';
import styles from './ModalForm.module.css';

interface ModalFormProps extends ModalProps {}

const ModalFormContext = createContext<Partial<ModalProps>>({});

export function ModalForm({
  className,
  children,
  ...modalProps
}: PropsWithChildren<ModalFormProps>) {
  return (
    <ModalFormContext.Provider value={modalProps}>
      <Modal
        {...modalProps}
        className={classNames(className, styles.root)}
      >
        {children}
      </Modal>
    </ModalFormContext.Provider>
  );
}

export const ModalFormBody = ({ className, children, ...props }: ModalBodyProps) => (
  <ModalBody {...props} className={classNames(className, styles.body)}>{children}</ModalBody>
);

export {
  ModalActions as ModalFormActions,
};

interface ModalFormSubmitButtonProps extends AsProps, ButtonProps {}

export const ModalFormSubmitButton = ({
  as: Component = Button, children = 'Submit', disabled, ...props
}: PropsWithChildren<ModalFormSubmitButtonProps>) => {
  const form = useFormContext();

  return (
    <Component
      {...props}
      type="submit"
      disabled={form.formState.isSubmitting || disabled}
    >
      {children}
    </Component>
  );
};

export const ModalFormCancelButton = ({ children = 'Cancel' }: PropsWithChildren<ButtonProps>) => {
  const modalFormContext = useContext(ModalFormContext);

  return (
    <Button
      appearance="default"
      onClick={modalFormContext.onRequestClose}
    >
      {children}
    </Button>
  );
};
