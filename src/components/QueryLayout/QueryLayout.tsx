/* eslint-disable max-len */
import React, {
  useState,
} from 'react';
import { Modal } from '../../components/Modal/Modal';
import { ModalBody } from '../../components/Modal/ModalBody';
import { QueryRoleForm } from './QueryRoleForm/QueryRoleForm';
import { QueryLayoutMain } from './QueryLayoutMain/QueryLayoutMain';

import styles from './QueryLayout.module.css';

export const QueryLayout = React.memo(() => {
  const [roleModalIsVisible, setRoleModalIsVisible] = useState(false);

  return (
    <>
      <Modal
        isOpen={roleModalIsVisible}
        onRequestClose={() => setRoleModalIsVisible(false)}
        className="QueryRoleFormModal"
        title="Set role"
      >
        <ModalBody>
          <QueryRoleForm
            onSubmit={() => setRoleModalIsVisible(false)}
          />
        </ModalBody>
      </Modal>
      <div className={styles.root}>
        <div className={styles.body}>
          <QueryLayoutMain />
        </div>
      </div>
    </>
  );
});

QueryLayout.displayName = 'QueryLayout';
