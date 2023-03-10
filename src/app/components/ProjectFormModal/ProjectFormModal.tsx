import React from 'react';
import { ModalProps } from '#shared/components/Modal/Modal';
import {
  ModalForm,
  ModalFormActions,
  ModalFormBody, ModalFormCancelButton, ModalFormSubmitButton,
} from '#shared/components/Modal/ModalForm/ModalForm';
import { CreateProjectForm } from '#shared/components/ProjectForm/CreateProjectForm';
import { forceShowOnboarding } from '#shared/utils/newProjectOnboarding';
import { useNewItemsCallbacks } from '#shared/hooks/useNewItem';
import { usePasswordStorage } from '#shared/hooks/passwordStorage';
import { apiErrorToaster } from '#api_client/utils';
import { ProjectFormFields } from '#shared/components/ProjectForm/ProjectFormFields/ProjectFormFields';
import { ConsoleRoutes } from '#shared/routes';
import { useHistory } from 'react-router-dom';
import { useProjectsContext } from '../../hooks/projectsContext';

interface ProjectFormModalProps extends ModalProps {}

export const ProjectFormModal = (props: ProjectFormModalProps) => {
  const { onProjectCreate } = useNewItemsCallbacks();
  const { setPassword } = usePasswordStorage();
  const { get } = useProjectsContext();
  const history = useHistory();

  return (
    <ModalForm
      title="Project Creation"
      data-qa="project_create_button_form"
      {...props}
    >
      <CreateProjectForm
        onSuccess={(data) => {
          get();
          forceShowOnboarding();
          onProjectCreate(data);
          setPassword(data.project.id, data.roles);
          // @ts-ignore
          props.onRequestClose();
          history.push(`${ConsoleRoutes.ProjectsItem.replace(
            ':projectId',
            data.project.id,
          )}`);
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
  );
};
