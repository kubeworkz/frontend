import React, { PropsWithChildren } from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';

// import { SvgIcon } from '../../components/SvgIcon/SvgIcon';

import { ModalHeader } from '../../components/Modal/ModalHeader';
import { SvgIcon } from '../../components/SvgIcon/SvgIcon';
import styles from './Modal.module.css';

export interface ModalProps extends ReactModal.Props {
  title?: string;
}
export const Modal = ({
  children, className, title, ...props
}: PropsWithChildren<ModalProps>) => {
  const closeBtn = props.onRequestClose
      && (
        <button
          type="button"
          className={classNames(styles.closeButton, {
            [styles.closeButton_insideTitle]: !!title,
          })}
          onClick={props.onRequestClose}
        >
          <SvgIcon name="close_20" />
        </button>
      );

  // filter data-attributes to pass it as object to ReactModal
  const data = Object.fromEntries(
    Object.entries(props)
      .filter(([propName]) => (propName.indexOf('data-') === 0))
      .map(([propName, propValue]) => ([propName.substring(5), propValue])),
  );

  return (
    <ReactModal
      appElement={document.body}
      {...props}
      overlayClassName={styles.overlay}
      className={classNames(className, styles.container)}
      data={data}
    >
      {title
        ? (
          <ModalHeader>
            {title}
            {closeBtn}
          </ModalHeader>
        ) : closeBtn}
      {children}
    </ReactModal>
  );
};
