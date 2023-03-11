import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { toast } from 'react-toastify';

import { Text } from '../../components/Text/Text';
import { useCurrentUser } from '../../hooks/currentUser';
import { AnyLink } from '../../components/AnyLink/AnyLink';
import { Button } from '../../components/Button/Button';
import { getCSRFToken } from '../../utils/getCSRFToken';
import { ToastError } from '../../components/Toast/Toast';
import { UserPic } from '../../components/UserPic/UserPic';

import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '../../components/Modal/ModalForm/ModalForm';
import { CreateProjectForm } from '../../components/ProjectForm/CreateProjectForm';
import { apiErrorToaster } from '../../api/utils';
import { ProjectFormFields } from '../../components/ProjectForm/ProjectFormFields/ProjectFormFields';
import { ProjectsList } from '../ProjectsList/ProjectsList';
import { ClientLogo } from '../ClientLogo/ClientLogo';
import { ConsentProps } from '../../types';

import styles from './ConsentForm.module.css';

const Header = ({ client }: ConsentProps) => (
  <div className={styles.header}>
    <ClientLogo logo={client?.logo} />
    <h1 className={styles.title}>
      Authorize
      {' '}
      {client?.name}
    </h1>
    {client?.redirectUrl && (
      <div className={styles.subtitle}>
        Authorizing will redirect to
        {' '}
        <Text bold>{client.redirectUrl}</Text>
      </div>
    )}
  </div>
);

const AccessInfo = ({ client, fixed }: ConsentProps) => {
  const {
    user: { image, name },
  } = useCurrentUser();
  const displayScopes = useMemo(
    () => fixed.filter(({ technical }) => !technical),
    [fixed],
  );
  return (
    <div className={styles.accessInfo}>
      <div className={styles.clientBlock}>
        <UserPic image={image} name={name} />
        <div className={styles.clientAccess}>
          <div className={styles.clientAccessHeader}>
            {client?.website ? (
              <AnyLink as="a" href={client.website} target="_blank">
                {client.name}
              </AnyLink>
            ) : (
              <Text>{client?.name || 'Third party'}</Text>
            )}
          </div>
          <div className={styles.clientAccessSubtitle}>
            would like permission to access your
            {' '}
            <Text as="span" bold>
              {name}
            </Text>
            {' '}
            account and perform the following actions on your behalf:
          </div>
        </div>
      </div>
      {displayScopes.length > 0 && (
        <ul className={styles.scopes}>
          {displayScopes.map((scope) => (
            <li key={scope.id}>{scope.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AuthorizeControls = ({
  onCancel,
  disabled,
}: {
  disabled: boolean;
  onCancel: () => void;
}) => (
  <div className={styles.controls}>
    {/* implement along with oauth reject consent
        https://github.com/cloudrockdatabase/cloud/issues/300
        <Button as="a" href="/oauth_consent_reject" appearance="secondary" wide>
    */}
    <Button type="button" onClick={onCancel} appearance="secondary" wide>
      Cancel
    </Button>
    <Button type="submit" disabled={disabled} appearance="primary" wide>
      Authorize
    </Button>
  </div>
);

const ProjectsHeader = () => (
  <div className={styles.header}>
    <div className={styles.title}>Select projects</div>
    <div className={styles.subtitle}>Please select a project(s) for access</div>
  </div>
);

export const ConsentForm = (props: ConsentProps) => {
  const [step, setStep] = React.useState<'auth_scopes' | 'cancelled'>(
    'auth_scopes',
  );
  const csrf = useMemo(getCSRFToken, []);
  const onCancel = useCallback(() => setStep('cancelled'), []);
  const [submitDisabled, setSubmitDisabled] = React.useState(
    props.projectsSelection !== undefined,
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  const verifyDisabled = useCallback(() => {
    setSubmitDisabled(
      !formRef.current?.querySelector('input:checked')
        && props.projectsSelection !== undefined,
    );
  }, []);
  const [createProjectFormVisible, setCreateProjectFormVisible] = useState(false);

  useEffect(() => {
    if (props.error) {
      toast(<ToastError body={props.error} />);
    }
  }, [props.error]);

  const searchParams = useMemo(() => window.location.search, []);

  return (
    <>
      <ModalForm
        title="Project Creation"
        data-qa="project_create_button_form"
        isOpen={createProjectFormVisible}
        onRequestClose={() => setCreateProjectFormVisible(false)}
        {...props}
      >
        <CreateProjectForm
          onSuccess={() => {
            window.location.reload();
          }}
          onFail={(err) => apiErrorToaster(err, 'project_create')}
        >
          <ModalFormBody>
            <ProjectFormFields />
          </ModalFormBody>
          <ModalFormActions>
            <ModalFormCancelButton />
            <ModalFormSubmitButton
              data-qa="project_create_button_form_submit"
              size="l"
            >
              Create project
            </ModalFormSubmitButton>
          </ModalFormActions>
        </CreateProjectForm>
      </ModalForm>
      <form
        ref={formRef}
        onChange={verifyDisabled}
        className={styles.root}
        action={`/oauth_consent${searchParams}`}
        method="post"
      >
        {step === 'auth_scopes' && (
          <>
            <Header {...props} />
            <AccessInfo {...props} />
            {props.projectsSelection && (
              <>
                <ProjectsHeader />
                <ProjectsList {...props} />
                <br />
                <Button
                  type="button"
                  onClick={() => setCreateProjectFormVisible(true)}
                >
                  Create new project
                </Button>
              </>
            )}
            <AuthorizeControls disabled={submitDisabled} onCancel={onCancel} />
          </>
        )}
        {step === 'cancelled' && (
          <div>You rejected the OAuth consent, this window can be closed</div>
        )}
        <input type="hidden" name="authenticity_token" value={csrf} />
        {props.fixed.map((scope) => (
          <input type="hidden" name="technical" value={scope.id} key={scope.id} />
        ))}
      </form>
    </>
  );
};
