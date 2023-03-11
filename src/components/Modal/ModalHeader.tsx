import React, { PropsWithChildren } from 'react';

import { Text } from '../../components/Text/Text';

import styles from './Modal.module.css';

export const ModalHeader = ({ children }: PropsWithChildren<{}>) => (
  <Text
    size="s"
    className={styles.header}
  >
    {children}
  </Text>
);
