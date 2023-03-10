import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { apiService, Project, Role } from '../../api/publicv2';
import { apiErrorToaster, createErrorText } from '../../api/utils';
import { Form } from '../../components/Form/Form';
import { FormField } from '../../components/Form/FormField/FormField';
import {
  FormSelect,
  SelectOption,
} from '../../components/Form/FormSelect/FormSelect';
import { Info } from '../../components/Info/Info';
import { Button } from '../../components/Button/Button';
import { StatusButton } from '../../components/Button/StatusButton/StatusButton';
import { getCSRFToken } from '../../utils/getCSRFToken';
import {
  SettingsDesc,
  SettingsPageHeader,
} from '../../components/Settings/Settings';
import { CreateProjectForm } from '../../components/ProjectForm/CreateProjectForm';

import {
  ModalForm,
  ModalFormActions,
  ModalFormBody,
  ModalFormCancelButton,
  ModalFormSubmitButton,
} from '../../components/Modal/ModalForm/ModalForm';
import { pgConnectionString } from '../../utils/connectionString';
import { ProjectFormFields } from '../../components/ProjectForm/ProjectFormFields/ProjectFormFields';
import { Alert } from '../../components/Alert/Alert';
import { Badge } from '../../components/Badge/Badge';
import { HelpBlock } from '../../components/HelpBlock/HelpBlock';
import { AnyLink } from '../../components/AnyLink/AnyLink';
import { FormCheckbox } from '../../components/Form/FormCheckbox/FormCheckbox';
import { generatePath } from 'react-router';
import { ConsoleRoutes, CONSOLE_BASE_ROUTE } from '../../routes/routes';
import { Divider } from '../../components/Divider/Divider';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { ExternalProject } from '../../types';
import { useProjectsContext } from '../../app/hooks/projectsContext';
import { ProjectsItemProvider } from '../../app/hooks/projectsItem';
import { DatabaseOption } from '../../app/hooks/projectDatabases';
import { RoleOption } from '../../app/hooks/projectRoles';
import { withDisableOnTransition } from '../../components/withDisableOnTransition/withDisableOnTransition';
import { Success } from '../Success/Success';
import { Failure } from '../Failure/Failure';
import { ProjectInternalsSelect } from './ProjectInternalsSelect';

import styles from './Vercel.module.css';

const ConnectButton = withDisableOnTransition(StatusButton);
const CONNECT_BUTTON_LABELS = ['Connect', 'Connecting...', 'Connected'] as const;

type VercelProps = {
  projects: ExternalProject[];
  connectedProjectsIds: string[];
  vercelIntegrationUrl: string;
};
type VercelForm = {
  vercelProjectId: string;
  cloudrockProjectId: string;
  role: RoleOption;
  database: DatabaseOption;
  endpoint: string;
  createDevBranch: boolean;
};

type Step = 'pick_vercel_project' | 'pick_cloudrock_project' | 'confirm' | 'final';
type StepState = {
  step: Step;
  error?: string;
  errorCode?: string;
};

type CloudrockSelectOption = {
  label: string;
  value: string;
  type: 'project' | 'create';
};

type VercelProjectSelectOption = {
  label: React.ReactNode;
  value: string;
  text: string;
  vercelProject: ExternalProject;
};

type ConnectionInfoRowProps = {
  envName: string;
  value: string;
};

const ConnectionInfoTable = ({ children }: { children: React.ReactNode }) => (
  <table className={styles.connectionInfoTable}>
    <tbody>
      {children}
    </tbody>
  </table>
);
const ConnectionInfoRow = ({ envName, value }: ConnectionInfoRowProps) => (
  <tr className={styles.connectionInfoRow}>
    <td className={styles.connectionInfoEnvName}>{envName}</td>
    <td className={styles.connectionInfoEnvValue}>{value}</td>
  </tr>
);

type ProjectProviderConditionalProps = {
  projectId?: string;
  children: React.ReactNode;
};
const ProjectProviderConditional = ({
  projectId,
  children,
}:ProjectProviderConditionalProps) => (projectId ? (
  <ProjectsItemProvider projectId={projectId}>
    {children}
  </ProjectsItemProvider>
) : (
  <>{children}</>
));

export const Vercel = ({ projects, connectedProjectsIds }: VercelProps) => {
  const { list, isLoading } = useProjectsContext();
  const { trackUiInteraction } = useAnalytics();
  const cloudrockOptions: CloudrockSelectOption[] = useMemo(
    () => list
      .map(
        ({ id, name }) => ({ value: id, label: name, type: 'project' } as CloudrockSelectOption),
      )
      .concat({
        label: 'Create a new project',
        type: 'create',
        value: '',
      } as CloudrockSelectOption),
    [list],
  );
  const vercelOptions = useMemo(
    () => projects.map(
      (project) => ({
        value: project.id,
        label: (
          <span>
            {project.name}
            {connectedProjectsIds.includes(project.id) && (
            <Badge appearance="warning">Connected</Badge>
            )}
          </span>
        ),
        text: project.name,
        vercelProject: project,
      } as VercelProjectSelectOption),
    ),
    [projects, connectedProjectsIds],
  );

  const csrf = useMemo(getCSRFToken, []);
  const [cloudrockProjectOpt, setCloudrockProjectOpt] = React.useState<CloudrockSelectOption>();
  const [vercelProjectOpt, setVercelProjectOpt] = React.useState(
    vercelOptions[0],
  );

  const form = useForm<VercelForm>({
    defaultValues: {
      vercelProjectId: vercelProjectOpt?.value,
      database: undefined,
      role: undefined,
      cloudrockProjectId: cloudrockProjectOpt?.value,
      endpoint: '',
      createDevBranch: true,
    },
  });
  const {
    handleSubmit, register, formState, setValue, getValues,
  } = form;

  const formValues = getValues();
  useEffect(() => {
    if (isLoading) return;
    if (list.length > 0) {
      setCloudrockProjectOpt(cloudrockOptions[0]);
      setValue('cloudrockProjectId', cloudrockOptions[0].value);
    }
  }, [isLoading, cloudrockOptions, list, setValue]);

  const [stepState, setStepState] = useState<StepState>({ step: 'pick_vercel_project' });
  const [roleWithPassword, setRoleWithPassword] = useState<Role>();
  const [isConnecting, setIsConnecting] = useState(false);
  useEffect(() => {
    const { step, error } = stepState;
    if (step === 'final') {
      if (error) {
        trackUiInteraction(AnalyticsAction.VercelIntegrationFailure, {
          error,
        });
      } else {
        trackUiInteraction(AnalyticsAction.VercelIntegrationSuccess);
      }
    } else {
      trackUiInteraction(AnalyticsAction[`VercelIntegrationStep_${step}`]);
    }
  }, [stepState, trackUiInteraction]);

  const onSubmit = useCallback(
    handleSubmit((data, event) => {
      if (event?.target.id !== 'vercel-form') return;
      setIsConnecting(true);
      apiService
        .listProjectBranches(data.cloudrockProjectId)
        .then(({ data: { branches } }) => {
          const branch = branches.find(({ parent_id }) => !parent_id);
          if (!branch) {
            throw new Error('No branch found');
          }
          return Promise.all([
            apiService.resetProjectBranchRolePassword(
              data.cloudrockProjectId,
              branch.id,
              data.role.role.name,
            ),
            apiService.listProjectBranchEndpoints(
              data.cloudrockProjectId,
              branch.id,
            ),
          ]);
        })
        .then(
          ([
            {
              data: { role },
            },
            {
              data: { endpoints },
            },
          ]) => {
            setRoleWithPassword(role);
            return fetch('/integrations/vercel', {
              method: 'POST',
              headers: {
                'X-CSRF-Token': csrf,
              },
              body: JSON.stringify({
                vercel_project_id: data.vercelProjectId,
                role: data.role.role.name,
                project_id: data.cloudrockProjectId,
                database: data.database.database.name,
                host: endpoints[0].host,
                password: role.password,
                create_dev_branch: data.createDevBranch,
              }),
            });
          },
        )
        .then((resp) => {
          if (resp.status >= 400) {
            resp.json().then(({ message, code }) => setStepState({ step: 'final', error: message, errorCode: code }));
          } else {
            setStepState({ step: 'final' });
          }
        })
        .catch((err) => setStepState({ step: 'final', error: err.response ? createErrorText(err) : String(err) }))
        .finally(() => {
          setIsConnecting(false);
        });
    }),
    [handleSubmit],
  );

  const [showCreateProject, setShowCreateProject] = React.useState(false);

  const onProjectChange = useCallback(
    (p: Project) => {
      setShowCreateProject(false);
      setValue('cloudrockProjectId', p.id);
      setCloudrockProjectOpt({ value: p.id, label: p.name, type: 'project' });
    },
    [setValue],
  );

  const onVercelProjectChange = useCallback(
    (p: SelectOption) => {
      setValue('vercelProjectId', p.value);
      setVercelProjectOpt(p as any);
    },
    [setValue],
  );

  const isSelectedProjectConnected = useMemo(
    () => connectedProjectsIds.includes(vercelProjectOpt?.value),
    [connectedProjectsIds, vercelProjectOpt],
  );

  const databaseUrl = useMemo(
    () => pgConnectionString({
      host: formValues.endpoint,
      database: formValues.database?.label,
      role: formValues.role?.label,
      password: '********',
    }),
    [formValues],
  );

  return (
    <ProjectProviderConditional projectId={cloudrockProjectOpt?.value}>
      <div className={styles.root}>
        <ModalForm
          isOpen={showCreateProject}
          onRequestClose={() => setShowCreateProject(false)}
          title="Project Creation"
        >
          <CreateProjectForm
            onSuccess={({ project }) => onProjectChange(project)}
            onFail={apiErrorToaster}
          >
            <ModalFormBody>
              <ProjectFormFields />
            </ModalFormBody>
            <ModalFormActions>
              <ModalFormCancelButton />
              <ModalFormSubmitButton size="l">
                Create project
              </ModalFormSubmitButton>
            </ModalFormActions>
          </CreateProjectForm>
        </ModalForm>
        <FormProvider {...form}>
          <Form id="vercel-form" method="post" onSubmit={onSubmit}>
            {stepState.step === 'pick_vercel_project' && (
            <div>
              <SettingsPageHeader>Integrate Cloudrock</SettingsPageHeader>
              <SettingsDesc>
                Select a Vercel project to add the integration to.
                <div className={styles.vercelProjectPick}>
                  {vercelOptions.length > 0 ? (
                    <>
                      <FormField
                        label="Vercel project"
                        error={formState.errors.vercelProjectId?.message}
                      >
                        <FormSelect
                          options={vercelOptions}
                          {...register('vercelProjectId', {
                            required: {
                              message: 'Pick Vercel project',
                              value: true,
                            },
                          })}
                          value={vercelProjectOpt}
                          onChange={onVercelProjectChange}
                        />
                      </FormField>
                      {isSelectedProjectConnected && (
                        <Alert
                          className={styles.projectConnectedAlert}
                          appearance="warning"
                        >
                          This project is already connected to a Cloudrock
                          project. This connection will be removed if
                          you connect to another Cloudrock project.
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Alert
                      className={styles.zeroVercelProjects}
                      appearance="warning"
                    >
                      You have no Vercel projects. Please create one, then try
                      the integrating again.
                    </Alert>
                  )}
                </div>
              </SettingsDesc>
              <Button
                type="button"
                size="m"
                wide
                disabled={vercelProjectOpt === undefined}
                onClick={() => setStepState({ step: 'pick_cloudrock_project' })}
              >
                Continue
              </Button>
              <Divider className={styles.helpBlockDivider} width="short" />
              <HelpBlock className={styles.helpBlock}>
                For information about resetting the connection, see
                {' '}
                <AnyLink as="a" target="_blank" href="https://cloudrock.ca/docs/guides/vercel">
                  Connect Vercel and Cloudrock.
                </AnyLink>
              </HelpBlock>
            </div>
            )}
            {stepState.step === 'pick_cloudrock_project' && (
            <div>
              <SettingsPageHeader>Integrate Cloudrock</SettingsPageHeader>
              <SettingsDesc>
                Connect Vercel project
                {' '}
                <strong>{vercelProjectOpt?.text}</strong>
                {' '}
                to a Cloudrock database. Select a Cloudrock project and database, and the
                role that Vercel will use to connect.
              </SettingsDesc>
              <FormField
                label="Cloudrock project"
                error={formState.errors.cloudrockProjectId?.message}
              >
                <FormSelect
                  options={cloudrockOptions}
                  className={styles.cloudrockProjectSelect}
                  {...register('cloudrockProjectId', {
                    required: { message: 'Pick Cloudrock project', value: true },
                  })}
                  value={cloudrockProjectOpt}
                  isLoading={isLoading}
                  onChange={(opt: any) => {
                    if (opt.type === 'create') {
                      setShowCreateProject(true);
                    } else {
                      setValue('cloudrockProjectId', opt.value);
                      setCloudrockProjectOpt(opt);
                    }
                  }}
                />
              </FormField>
              {cloudrockProjectOpt && (
              <ProjectInternalsSelect />
              )}
              <FormField id="createDevBranch">
                <FormCheckbox {...register('createDevBranch')}>
                  Create a branch for the development environment
                </FormCheckbox>
              </FormField>
              <div className={styles.buttons}>
                <Button
                  appearance="secondary"
                  size="m"
                  type="button"
                  className={styles.button}
                  onClick={() => setStepState({ step: 'pick_vercel_project' })}
                >
                  Back
                </Button>
                <Button
                  size="m"
                  className={styles.button}
                  form="vercel-form"
                  type="button"
                  disabled={cloudrockProjectOpt === undefined}
                  onClick={() => setStepState({ step: 'confirm' })}
                >
                  Continue
                </Button>
              </div>
            </div>
            )}
            {stepState.step === 'confirm' && (
            <div>
              <SettingsPageHeader>Integrate Cloudrock</SettingsPageHeader>
              <SettingsDesc>
                Confirm integration settings between Vercel project
                {' '}
                <strong>{vercelProjectOpt?.text}</strong>
                {' '}
                and Cloudrock project
                {' '}
                <strong>{cloudrockProjectOpt?.label}</strong>
                .
              </SettingsDesc>
              <Info className={styles.connectionInfo}>
                The integration sets these environment variables:
              </Info>
              <ConnectionInfoTable>
                <ConnectionInfoRow
                  envName="PGHOST"
                  value={getValues().endpoint}
                />
                <ConnectionInfoRow
                  envName="PGUSER"
                  value={getValues().role?.label}
                />
                <ConnectionInfoRow
                  envName="PGDATABASE"
                  value={getValues().database?.label}
                />
                <ConnectionInfoRow envName="PGPASSWORD" value="******" />
                <ConnectionInfoRow envName="DATABASE_URL" value={databaseUrl} />
              </ConnectionInfoTable>
              <Alert appearance="warning" className={styles.connectionWarning}>
                The password will be reset for this role automatically. You can
                manage users and reset passwords on the
                {' '}
                <AnyLink
                  as="a"
                  target="_blank"
                  href={generatePath(CONSOLE_BASE_ROUTE + ConsoleRoutes.ProjectsItemRoles, {
                    projectId: cloudrockProjectOpt?.value ?? '',
                  })}
                >
                  Roles
                </AnyLink>
                {' '}
                page.
              </Alert>
              <div className={styles.buttons}>
                <Button
                  appearance="secondary"
                  size="m"
                  type="button"
                  className={styles.button}
                  onClick={() => setStepState({ step: 'pick_cloudrock_project' })}
                >
                  Back
                </Button>
                <ConnectButton
                  size="m"
                  className={styles.button}
                  form="vercel-form"
                  type="submit"
                  label={CONNECT_BUTTON_LABELS}
                  loading={isConnecting}
                  disabled={isConnecting}
                />
              </div>
              <Divider className={styles.helpBlockDivider} width="short" />
              <HelpBlock className={styles.helpBlock}>
                For information about Vercel environments and related variables,
                see
                {' '}
                <AnyLink
                  as="a"
                  target="_blank"
                  href="https://vercel.com/docs/concepts/deployments/environments"
                >
                  Environments
                </AnyLink>
                {' '}
                , and
                {' '}
                <AnyLink
                  as="a"
                  target="_blank"
                  href="https://vercel.com/docs/concepts/projects/environment-variables"
                >
                  Environment Variables.
                </AnyLink>
              </HelpBlock>
            </div>
            )}
            {stepState.step === 'final' && (
            <div>
              {stepState.error ? (
                <Failure
                  error={stepState.error}
                  errorCode={stepState.errorCode ?? ''}
                  vercelProject={vercelProjectOpt?.vercelProject}
                  cloudrockProject={cloudrockProjectOpt?.label ?? ''}
                  roleWithPassword={roleWithPassword}
                  onRestart={() => { setStepState({ step: 'pick_vercel_project' }); }}
                />
              ) : (
                <Success
                  vercelProject={vercelProjectOpt?.text}
                  cloudrockProject={cloudrockProjectOpt?.label ?? ''}
                  roleWithPassword={roleWithPassword}
                />
              )}
            </div>
            )}
          </Form>
        </FormProvider>
      </div>
    </ProjectProviderConditional>
  );
};
