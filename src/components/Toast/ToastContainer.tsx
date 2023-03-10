import React from 'react';
import { ToastContainer as ToastContainerInitial, ToastContainerProps } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import styles from './ToastContainer.module.css';

export const ToastContainer = (props: ToastContainerProps) => (
  <ToastContainerInitial
    newestOnTop
    hideProgressBar
    position="bottom-center"
    toastClassName={styles.toast}
    bodyClassName={styles.toastBody}
    closeButton={false}
    className={styles.container}
    {...props}
  />
);
