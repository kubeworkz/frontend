import React from 'react';

import { Button } from '#shared/components/Button/Button';
import { ProjectFormFields } from '#shared/components/ProjectForm/ProjectFormFields/ProjectFormFields';
import { CreateProjectForm } from '#shared/components/ProjectForm/CreateProjectForm';
import { apiErrorToaster } from '#api_client/utils';
import { useConnectAppContext } from '../../context/connectApp';

import styles from './ProjectForm.module.css';

export const ProjectForm = () => {
  const { onConnectEndpoint } = useConnectAppContext();

  return (
    <CreateProjectForm
      onSuccess={(data) => data.endpoints[0]
        && onConnectEndpoint(data.endpoints[0], data.project)}
      onFail={apiErrorToaster}
    >
      <div className={styles.header}>Project creation</div>
      <ProjectFormFields
        blockLabels
      />
      <div className={styles.actions}>
        <Button type="submit">
          Create project
        </Button>
      </div>
    </CreateProjectForm>
  );
};
