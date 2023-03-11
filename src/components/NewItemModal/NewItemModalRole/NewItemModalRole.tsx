import React from 'react';
import classNames from 'classnames';
import { Modal, ModalProps } from '../../../components/Modal/Modal';
import { OperationsResponse, RoleResponse } from '../../../api/generated/api_public_v2';
import { ModalBody } from '../../../components/Modal/ModalBody';
import { Button } from '../../../components/Button/Button';
import { Text } from '../../../components/Text/Text';
import { CodeBlock, CodeSpan } from '../../../components/Code/Code';
import { HiddenPassword } from '../../../components/HiddenPassword/HiddenPassword';

import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import styles from '../NewItemModal.module.css';

interface NewItemModalRoleProps extends ModalProps {
  data: RoleResponse & OperationsResponse;
}

export const NewItemModalRole = ({ data, className, ...props }: NewItemModalRoleProps) => {
  const { role } = data;
  const { trackUiInteraction } = useAnalytics();

  const url = React.useMemo(() => {
    if (!role) {
      return '';
    }

    const envData = `PGUSER=${role.name}\n`
      + `PGPASSWORD=${role.password}`;
    const blob = new Blob([envData], { type: '' });
    return window.URL.createObjectURL(blob);
  }, [data]);

  React.useEffect(() => () => window.URL.revokeObjectURL(url), [url]);

  if (!role) {
    return null;
  }

  return (
    <Modal
      {...props}
      title={`User ${role.name} created!`}
      className={classNames(className, styles.root)}
    >
      <ModalBody>
        <Text>
          User
          {' '}
          <CodeSpan>{role.name}</CodeSpan>
          {' '}
          was successfully created. Copy the password or download the .env file.
          The password cannot be displayed again after closing this dialog.
          <br />
          <br />
          Password:
        </Text>
        <br />
        <CodeBlock
          textToCopy={role.password}
          onCopy={() => (
            trackUiInteraction(AnalyticsAction.RoleCreatedPopupCopyPasswordClicked)
          )}
        >
          <HiddenPassword value={role.password} />
        </CodeBlock>
        <br />
        {url && (
          <>
            <Text>
              Download the .env file to save the user&apos;s password.
            </Text>
            <br />
            <div className={styles.buttonContainer}>
              <Button
                as="a"
                target="_blank"
                href={url}
                download=".env"
                onClick={() => (
                  trackUiInteraction(AnalyticsAction.RoleCreatedPopupDownloadCredentialsClicked)
                )}
              >
                Download .env
              </Button>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};
