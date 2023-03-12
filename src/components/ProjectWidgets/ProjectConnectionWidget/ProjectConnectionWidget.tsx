import React, { HTMLAttributes, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { FormField } from '../../../components/Form/FormField/FormField';
import { CodeBlock } from '../../../components/Code/Code';
import { Widget } from '../../../components/Widget/Widget';
import { WidgetBody } from '../../../components/Widget/WidgetBody';
import { Modal } from '../../../components/Modal/Modal';
import { ModalBody } from '../../../components/Modal/ModalBody';
import { Role } from '../../../api/publicv2';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { Button } from '../../../components/Button/Button';
import { Alert } from '../../../components/Alert/Alert';
import { ConnectionString } from '../../../components/ConnectionString/ConnectionString';
import { pgConnectionString } from '../../../utils/connectionString';
import { usePasswordStorage } from '../../../hooks/passwordStorage';
import { ToggleSwitch } from '../../../components/ToggleSwitch/ToggleSwitch';
import { FormLabel } from '../../../components/Form/FormLabel/FormLabel';
import { WithTooltip } from '../../../components/WithTooltip/WithTooltip';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';
import { DatabaseOption } from '../../../app/hooks/projectDatabases';
import { RoleSelect } from '../../RoleSelect/RoleSelect';
import { ResetRolePassword } from '../../ResetRolePassword/ResetRolePassword';
import { DatabaseSelect } from '../../DatabaseSelect/DatabaseSelect';
import { withDisableOnTransition } from '../../withDisableOnTransition/withDisableOnTransition';
import { RoleOption } from '../../../app/hooks/projectRoles';
import { ProjectWidgetPlaceholder } from '../ProjectWidgetPlaceholder/ProjectWidgetPlaceholder';
import { useSelectedBranch } from '../../../app/hooks/selectedBranchProvider';
import { EndpointSelect } from '../../EndpointSelect/EndpointSelect';
import { EndpointOption, useProjectEndpoints } from '../../../app/hooks/projectEndpoints';
import { ProjectConnectionWidgetSnippets } from './ProjectConnectionWidgetSnippets';

import styles from './ProjectConnectionWidget.module.css';

const TransitionButton = withDisableOnTransition(Button);

export const ProjectConnectionWidget = (
  props: HTMLAttributes<HTMLDivElement>,
) => {
  const { trackUiInteraction } = useAnalytics();
  const {
    projectId,
    isLoading: isProjectLoading,
    project,
  } = useProjectsItemContext();

  const { setBranch } = useSelectedBranch();
  const { selectOptions: endpointOptions } = useProjectEndpoints();
  const [role, setRole] = React.useState<RoleOption>();
  const [database, setDatabase] = React.useState<DatabaseOption>();
  const [endpointOption, setEndpointOption] = React.useState<EndpointOption | null>();

  const [snippetsVisible, setSnippetsVisible] = React.useState(false);
  const [poolerEnabled, setPoolerEnabled] = React.useState(false);
  const {
    getPassword, setPassword, clearPasswords, revealPassword,
  } = usePasswordStorage();

  const [passwordLoading, setPasswordLoading] = React.useState(false);

  useEffect(() => {
    if (!role || !project?.store_passwords) {
      return;
    }
    setPasswordLoading(true);
    revealPassword(projectId, role?.role).finally(() => {
      setPasswordLoading(false);
    });
  }, [projectId, role, revealPassword]);

  const isLoading = isProjectLoading;

  const password = React.useMemo(() => {
    if (isLoading || !project || !endpointOption || !endpointOption.branch) {
      return '';
    }

    return endpointOption && role
      ? getPassword(projectId, endpointOption.branch.id, role.role.name)
      : undefined;
  }, [endpointOption, role, getPassword]);

  const connectionCommand: [React.ReactNode, string] | null = React.useMemo(() => {
    if (isLoading || !project || !endpointOption) {
      return ['', ''];
    }

    const host = `${endpointOption.endpoint.id}${poolerEnabled ? '-pooler' : ''}.${project.proxy_host}`;

    return [
      <ConnectionString
        user={role?.role.name}
        password={password}
        passwordLoading={passwordLoading}
        database={database?.database.name}
        host={host}
      />,
      pgConnectionString({
        role: role?.role.name,
        database: database?.database.name,
        host,
        password,
      }),
    ];
  }, [
    isLoading,
    project,
    endpointOption,
    poolerEnabled,
    role,
    password,
    passwordLoading,
    database,
  ]);

  const onCreateRole = React.useCallback(
    (r: Role) => {
      setPassword(projectId, r);
      setRole({
        value: r.name,
        label: r.name,
        role: r,
      });
    },
    [projectId],
  );

  useEffect(() => {
    if (endpointOption?.branch) {
      setBranch(endpointOption.branch);
    }
  }, [endpointOption?.branch]);

  useEffect(() => {
    // when branching is enabled this will be handled by endpoint selector.
    // not sure if it's right, probably we should handle default values in the components
    if (
      (!endpointOption
        || endpointOption.endpoint.project_id !== projectId
        || !endpointOption.branch)
      && endpointOptions.length
    ) {
      setEndpointOption(endpointOptions[0]);
    }
  }, [endpointOptions, projectId]);

  useEffect(() => {
    if (endpointOption && endpointOption.endpoint.pooler_enabled) {
      setPoolerEnabled(false);
    }
  }, [endpointOption]);

  const onOpenSnippets = React.useCallback(() => {
    trackUiInteraction(AnalyticsAction.CodeSamplesOpened);
    setSnippetsVisible(true);
  }, []);

  const onCloseSnippets = React.useCallback(() => {
    trackUiInteraction(AnalyticsAction.CodeSamplesClosed);
    setSnippetsVisible(false);
  }, []);

  const onPasswordChange = React.useCallback(
    (r: Role) => {
      setPassword(projectId, r);
    },
    [setPassword, projectId],
  );

  const onEndpointChange = useCallback((option: EndpointOption) => {
    setEndpointOption(option);
  }, []);

  React.useEffect(
    () => () => {
      clearPasswords(projectId);
    },
    [projectId],
  );

  const poolerToggleDisabled = !endpointOption || endpointOption.endpoint.pooler_enabled;

  if (isLoading || !project) {
    return <ProjectWidgetPlaceholder />;
  }

  return (
    <>
      {snippetsVisible && (
        <Modal
          isOpen
          className={styles.snippets}
          onRequestClose={onCloseSnippets}
          title="See code samples for language specific integrations"
        >
          <ModalBody>
            <ProjectConnectionWidgetSnippets
              connectionData={{
                role: role && role.role.name,
                database: database && database.database.name,
                projectName: (endpointOption
                  ? `${endpointOption.endpoint.id}${poolerEnabled ? '-pooler' : ''}`
                  : projectId),
                host: project.proxy_host,
                password,
              }}
            />
          </ModalBody>
        </Modal>
      )}
      <Widget
        {...props}
        title="Connection Details"
        links={[
          // {
          //   as: 'button',
          //   children: 'Code samples',
          //   onClick: onOpenSnippets,
          // },
          ...(endpointOption && endpointOption.branch
            ? [
              {
                as: 'div',
                children: role ? (
                  <ResetRolePassword
                    role={role.role}
                    branch={endpointOption.branch}
                    onPasswordChanged={onPasswordChange}
                  >
                    {(onClick) => (
                      <TransitionButton
                        appearance="default"
                        type="button"
                        onClick={onClick}
                      >
                        Reset password
                      </TransitionButton>
                    )}
                  </ResetRolePassword>
                ) : (
                  <button disabled type="button">
                    Reset password
                  </button>
                ),
              } as const,
            ]
            : []),
        ]}
      >
        {endpointOption ? (
          <>
            <WidgetBody className={styles.root}>
              <FormField
                id="branch"
                className={classNames(styles.col, styles.col_wide)}
                label="Branch"
              >
                <EndpointSelect
                  value={endpointOption}
                  onChange={onEndpointChange}
                />
              </FormField>
            </WidgetBody>
            <WidgetBody className={styles.root}>
              <FormField id="database" className={styles.col} label="Database">
                <DatabaseSelect value={database} onChange={setDatabase} />
              </FormField>
              <FormField id="role" className={styles.col} label="User">
                <RoleSelect
                  onAddUser={onCreateRole}
                  onChange={(o: any) => setRole(o as RoleOption)}
                  value={role}
                />
              </FormField>
            </WidgetBody>
            {connectionCommand && (
            <WidgetBody>
              <FormField>
                <FormLabel
                  as="div"
                  className={styles.label_connstring}
                >
                  <span>
                    Connection string:
                  </span>
                  <WithTooltip
                    tooltipInner={poolerToggleDisabled
                      ? 'Disable pooler option in the compute endpoint settings to be able to enable pooling with a connection string'
                      : ''}
                  >
                    {(p) => (
                      <div {...p} className={styles.poolerToggle}>
                        Pooler:
                        <ToggleSwitch
                          size="s"
                          checked={poolerEnabled}
                          onChange={(e) => {
                            trackUiInteraction(AnalyticsAction.ConnectionDetailsPoolerChanged);
                            setPoolerEnabled(e.target.checked);
                          }}
                          disabled={poolerToggleDisabled}
                        />
                      </div>
                    )}
                  </WithTooltip>
                </FormLabel>
                <CodeBlock
                  textToCopy={connectionCommand[1]}
                  onCopy={() => {
                    trackUiInteraction(AnalyticsAction.ConnectionDetailsConnstringCopied);
                  }}
                  copyDisabled={passwordLoading}
                >
                  {connectionCommand[0]}
                </CodeBlock>
              </FormField>
              <Alert>
                Use the connection string to connect to a Cloudrock
                database from a client or application. See
                {' '}
                <Button className={styles.textLink} appearance="default" onClick={onOpenSnippets}>connection examples</Button>
                {' '}
                for how to connect from different languages and frameworks.
              </Alert>
            </WidgetBody>
            )}
          </>
        ) : (
          <WidgetBody>
            <Alert>
              You don&apos;t have any compute endpoints. Create one to get
              started.
            </Alert>
          </WidgetBody>
        )}
      </Widget>
    </>
  );
};
