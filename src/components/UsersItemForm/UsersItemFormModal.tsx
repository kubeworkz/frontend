import React from 'react';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import { Modal } from '../../components/Modal/Modal';
import { ModalHeader } from '../../components/Modal/ModalHeader';
import { ModalActions } from '../../components/Modal/ModalActions';
import { Button } from '../../components/Button/Button';
import { ModalBody } from '../../components/Modal/ModalBody';
import { useRequest } from '../../hooks/request';
import { Loader } from '../../components/Loader/Loader';
import {
  UsersItemFormSettings,
  UsersItemFormProps,
} from './UsersItemFormSettings';

import styles from './UsersItemFormModal.module.css';

export const UsersItemFormModal = (props: Omit<UsersItemFormProps, 'schema'>) => {
  const schema = useRequest(
    () => axios.get('/api-ref/v1/swagger.json'),
    [],
  );

  return (
    <Modal
      isOpen
      onRequestClose={props.onDecline}
      className={styles.modal}
    >
      <ModalHeader>
        Edit user settings:
        {' '}
        {props.user.name}
      </ModalHeader>
      <ModalBody>
        <Sentry.ErrorBoundary fallback={() => (
          <>Something went wrong</>
        )}
        >
          {schema.isLoading && <Loader />}
          {!schema.isLoading && !schema.data && 'Failed to fetch schema, please reload the page'}
          {!schema.isLoading && !!schema.data && (
          <UsersItemFormSettings
            {...props}
            schema={{
              // @ts-ignore
              limits: schema.data.data.components.schemas.UserSettingsLimits.properties,
              // @ts-ignore
              features: schema.data.data.components.schemas.UserSettingsFeatures.properties,
            }}
          />
          )}
        </Sentry.ErrorBoundary>
      </ModalBody>
      <ModalActions>
        <Button
          type="button"
          onClick={props.onDecline}
          appearance="secondary"
        >
          Close
        </Button>
        <Button type="submit" form="user_edit" disabled={schema.isLoading || !!schema.error}>Save</Button>
      </ModalActions>
    </Modal>
  );
};
