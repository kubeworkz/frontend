import React, { MouseEventHandler } from 'react';
import {
  apiService, Branch, Role, RoleResponse,
} from '../../api/publicv2';
import { Modal } from '../../components/Modal/Modal';
import { Text } from '../../components/Text/Text';
import { StatusButton } from '../../components/Button/StatusButton/StatusButton';
import { Button } from '../../components/Button/Button';
import { CodeBlock, CodeSpan } from '../../components/Code/Code';
import { ModalActions } from '../../components/Modal/ModalActions';
import { ModalBody } from '../../components/Modal/ModalBody';
import { apiErrorToaster } from '../../api/utils';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { HiddenPassword } from '../../components/HiddenPassword/HiddenPassword';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';
import { useAppCache } from '../../hooks/cache';

import styles from './ResetRolePassword.module.css';

interface ResetRolePasswordProps {
  role: Role;
  branch: Branch;
  children: (onResetClick: MouseEventHandler<HTMLElement>) => React.ReactNode;
  onPasswordChanged?: (Role: Role) => void;
}

export const ResetRolePassword = ({
  role,
  branch,
  children,
  onPasswordChanged,
}: ResetRolePasswordProps) => {
  const { projectId } = useProjectsItemContext();
  const { setAppCache } = useAppCache();
  const { trackUiInteraction } = useAnalytics();

  const [response, setResponse] = React.useState<RoleResponse>();
  const [confirmationIsVisible, setConfirmationIsVisible] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordInfoIsVisible, setPasswordInfoIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const branchId = branch.id;

  const onConfirm = React.useCallback(() => {
    setIsLoading(true);
    apiService.resetProjectBranchRolePassword(projectId, branchId, encodeURIComponent(role.name))
      .then(({ data }) => {
        setResponse(data);
        setPasswordInfoIsVisible(true);
        setConfirmationIsVisible(false);
        if (onPasswordChanged) {
          onPasswordChanged(data.role);
        }
        setPassword(data.role.password || '');
      })
      .catch(apiErrorToaster)
      .finally(() => setIsLoading(false));
  }, [role, onPasswordChanged, branchId]);

  React.useEffect(() => {
    if (!passwordInfoIsVisible) {
      // reset state
      setResponse(undefined);
      setIsLoading(false);
    }
  }, [passwordInfoIsVisible]);

  const url = React.useMemo(() => {
    const envData = `PGUSER=${role.name}\n`
      + `PGPASSWORD=${password}`;
    const blob = new Blob([envData], { type: '' });
    return window.URL.createObjectURL(blob);
  }, [role, password]);

  React.useEffect(() => () => window.URL.revokeObjectURL(url), [url]);

  return (
    <>
      {confirmationIsVisible
      && (
      <Modal
        isOpen
        onRequestClose={() => setConfirmationIsVisible(false)}
        className={styles.confirmation}
        data-qa="reset_role_password_confirmation"
      >
        <ModalBody>
          <div className={styles.confirmation_title}>
            Are you sure you want to reset the password?
          </div>
          <div className={styles.confirmation_row}>
            You are about to reset the password for&nbsp;
            <CodeSpan>
              {role.name}
            </CodeSpan>
            {' '}
            for the branch&nbsp;
            <CodeSpan>
              {branch.name}
            </CodeSpan>
          </div>
          <div className={styles.confirmation_row}>
            The previous password will no longer be valid.
          </div>
        </ModalBody>
        <ModalActions>
          <Button
            appearance="default"
            onClick={() => setConfirmationIsVisible(false)}
          >
            No, keep the old one
          </Button>
          <StatusButton
            succeed={!!response}
            loading={isLoading}
            label={['Sure, reset', 'Loading', 'Done']}
            onClick={onConfirm}
          />
        </ModalActions>
      </Modal>
      )}
      {passwordInfoIsVisible && password
      && (
      <Modal
        isOpen
        onRequestClose={() => { setPasswordInfoIsVisible(false); setAppCache({}); }}
        className={styles.resetSucceedModal}
        title="Reset password"
        data-qa="reset_role_password_success"
      >
        <ModalBody className={styles.resetSucceedModalBody}>
          <Text>
            Password for the user
            {' '}
            <CodeSpan>{role.name}</CodeSpan>
            {' '}
            in the branch
            {' '}
            <CodeSpan>{branch.name}</CodeSpan>
            {' '}
            was reset successfully. Copy the password or download the .env file.
            The password cannot be displayed again after closing this dialog.
            <br />
            <br />
            Password:
          </Text>
          <br />
          <CodeBlock
            textToCopy={password}
            onCopy={() => (
              trackUiInteraction(AnalyticsAction.ResetPasswordCopyPasswordClicked)
            )}
          >
            <HiddenPassword value={password} />
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
                    trackUiInteraction(AnalyticsAction.ResetPasswordDownloadCredentialsClicked)
                  )}
                >
                  Download .env
                </Button>
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
      )}
      {children(() => {
        trackUiInteraction(AnalyticsAction.ConnectionDetailsPasswordResetClicked);
        setConfirmationIsVisible(true);
      })}
    </>
  );
};
