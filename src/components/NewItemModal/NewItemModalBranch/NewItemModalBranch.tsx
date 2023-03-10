import React from 'react';
import { Modal, ModalProps } from '#shared/components/Modal/Modal';
import {
  BranchResponse,
  EndpointsResponse,
  OperationsResponse,
} from '#api_client/publicv2';
import { ModalBody } from '#shared/components/Modal/ModalBody';
import { CodeBlock } from '#shared/components/Code/Code';
import { Button } from '#shared/components/Button/Button';
import { generatePath, NavLink } from 'react-router-dom';
import { ConsoleRoutes } from '#shared/routes';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { Alert } from '#shared/components/Alert/Alert';
import { HelpBlock } from '#shared/components/HelpBlock/HelpBlock';
import { AnyLink } from '#shared/components/AnyLink/AnyLink';

import styles from './NewItemModalBranch.module.css';

interface NewItemModalBranchProps extends ModalProps {
  data: BranchResponse & EndpointsResponse & OperationsResponse;
}

export const NewItemModalBranch = ({
  data,
  ...props
}: NewItemModalBranchProps) => {
  const endpoint = React.useMemo(() => data.endpoints[0], [data]);
  const { trackUiInteraction } = useAnalytics();

  return (
    <Modal
      {...props}
      title="Connection details for your new branch"
      data-qa="create_branch_success"
    >
      <ModalBody>
        {endpoint ? (
          <>
            <Alert appearance="success" iconName="success_50">
              The
              {' '}
              <b>{data.branch.name}</b>
              {' '}
              branch was created successfully. Use the
              endpoint details below to connect to your branch.
            </Alert>
            <CodeBlock
              className={styles.endpointHost}
              textToCopy={endpoint.host}
              onCopy={() => trackUiInteraction(
                AnalyticsAction.BranchCreatedPopupCopyHostClicked,
              )}
            >
              {endpoint.host}
            </CodeBlock>
            <HelpBlock className={styles.helpConnect}>
              Manage users and passwords on the
              {' '}
              <Button
                as={NavLink}
                className={styles.helpLink}
                appearance="default"
                size="s"
                to={generatePath(ConsoleRoutes.ProjectsItemRoles, {
                  projectId: data.branch.project_id,
                })}
              >
                Roles
              </Button>
              {' '}
              page.
            </HelpBlock>
          </>
        ) : (
          <>
            <Alert appearance="success" iconName="success_50">
              <b>{data.branch.name}</b>
              {' '}
              branch was created successfully
            </Alert>
            <HelpBlock className={styles.helpConnect}>
              Use parent branch user and password to connect or
              {' '}
              <Button
                as={NavLink}
                className={styles.helpLink}
                appearance="default"
                size="s"
                to={generatePath(ConsoleRoutes.ProjectsItemRoles, {
                  projectId: data.branch.project_id,
                })}
              >
                create a new user
              </Button>
              {' '}
              for the branch
            </HelpBlock>
          </>
        )}
        <div className={styles.footer}>
          <span className={styles.footerMessage}>
            For more information, see
            {' '}
            <AnyLink className={styles.docsLink} as="a" target="_blank" href="https://cloudrock.ca/docs/manage/branches#connect-to-a-branch">
              Connect to a branch.
            </AnyLink>
          </span>
        </div>
      </ModalBody>
    </Modal>
  );
};
