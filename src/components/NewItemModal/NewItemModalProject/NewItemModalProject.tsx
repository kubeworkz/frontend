import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Modal, ModalProps } from '../../../components/Modal/Modal';
import {
  BranchResponse,
  ConnectionURIsResponse,
  DatabasesResponse,
  EndpointsResponse,
  OperationsResponse,
  ProjectResponse,
  RolesResponse,
} from '../../../api/generated/api_public_v2';
import { ModalBody } from '../../../components/Modal/ModalBody';
import { Button } from '../../../components/Button/Button';

import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { Alert } from '../../../components/Alert/Alert';
import { FormField } from '../../../components/Form/FormField/FormField';
import { FormSelect } from '../../../components/Form/FormSelect/FormSelect';
import {
  Snippet,
  SnippetConnectionData,
  SnippetsOrder,
  SnippetTypeLabels,
} from '../../../components/Snippet/Snippet';
import { HelpBlock } from '../../../components/HelpBlock/HelpBlock';
import { ConsoleRoutes } from '../../../routes/routes';
import { generatePath, NavLink } from 'react-router-dom';
import styles from './NewItemModalProject.module.css';

interface NewItemModalProjectProps extends ModalProps {
  data: ProjectResponse &
  ConnectionURIsResponse &
  RolesResponse &
  DatabasesResponse &
  OperationsResponse &
  BranchResponse &
  EndpointsResponse;
}

const ConnectionSnippetOptions = SnippetsOrder.map((snippet) => ({
  label: SnippetTypeLabels[snippet],
  value: snippet,
}));

export const NewItemModalProject = ({
  data,
  className,
  ...props
}: NewItemModalProjectProps) => {
  const role = React.useMemo(
    () => data.roles.find((r) => !r.protected),
    [data],
  );
  const database = React.useMemo(() => data.databases[0], [data]);
  const endpoint = React.useMemo(() => data.endpoints[0], [data]);
  const { trackUiInteraction } = useAnalytics();

  const [snippetTypeOpt, setSnippetTypeOpt] = React.useState(
    ConnectionSnippetOptions[0],
  );

  const connectionData = useMemo(
    (): SnippetConnectionData => ({
      host: endpoint.host,
      database: database.name,
      password: role?.password,
      role: role?.name,
      projectName: data.project.name,
    }),
    [endpoint, database, role],
  );

  if (!role || !database || !endpoint) {
    return null;
  }

  return (
    <Modal
      {...props}
      title="Connection details for your new project"
      className={classNames(className, styles.root)}
      data-qa="create_project_success"
    >
      <ModalBody>
        <Alert
          appearance="success"
          iconName="success_50"
        >
          The
          {' '}
          <b>{data.project.name}</b>
          {' '}
          project was created successfully. Use the
          connection details below to connect to the default
          {' '}
          <b>cloudrockdb</b>
          {' '}
          database.
        </Alert>
        <div className={styles.connectionBar}>
          <div className={styles.connectionBarLeft}>
            <FormField label="Connect using">
              <FormSelect
                size="s"
                options={ConnectionSnippetOptions}
                value={snippetTypeOpt}
                onChange={setSnippetTypeOpt}
              />
            </FormField>
          </div>
          <div className={styles.connectionBarRight}>
            <HelpBlock>
              {data.project.store_passwords ? (
                <>
                  Your password was saved to a secure storage vault.
                  You can retrieve it from the Connection details widget
                </>
              ) : (
                <>
                  The password is not accessible after closing this dialog. You can
                  reset the password on the
                  {' '}
                  <Button
                    as={NavLink}
                    appearance="default"
                    size="s"
                    to={generatePath(ConsoleRoutes.ProjectsItemRoles, {
                      projectId: data.project.id,
                    })}
                  >
                    Roles
                  </Button>
                  {' '}
                  page.
                </>
              )}
            </HelpBlock>
          </div>
        </div>
        <Snippet
          type={snippetTypeOpt.value}
          connectionData={connectionData}
          onCopy={() => trackUiInteraction(
            AnalyticsAction.ProjectCreatedPopupCopyConnectionStringClicked,
          )}
        />
      </ModalBody>
    </Modal>
  );
};
