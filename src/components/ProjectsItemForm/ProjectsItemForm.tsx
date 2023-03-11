import React from 'react';
import { AdminProject, internalApiService } from '../../api/internal';
import { Form } from '../../components/Form/Form';
import { useForm } from 'react-hook-form';
import { FormLabel } from '../../components/Form/FormLabel/FormLabel';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { FormField } from '../../components/Form/FormField/FormField';
import { Text } from '../../components/Text/Text';
import { mbAsGB } from '../../utils/sizeHelpers';

export interface ProjectsItemFormProps {
  project: AdminProject;
  onSubmit?: () => void;
  onDecline?: () => void;
}

interface ProjectsItemFormData {
  max_project_size: string;
}

export const ProjectsItemForm = ({ project, onSubmit }: ProjectsItemFormProps) => {
  const form = useForm<ProjectsItemFormData>({
    mode: 'onChange',
    defaultValues: {
      max_project_size: project.max_project_size?.toString(),
    },
  });

  const {
    formState: {
      errors,
    },
    handleSubmit,
  } = form;

  const {
    max_project_size: maxProjectSizeValue,
  } = form.watch();

  const maxProjectSizeValueInt = React.useMemo(
    () => parseInt(maxProjectSizeValue, 10),
    [maxProjectSizeValue],
  );

  const onFormSubmit = React.useCallback((formData: ProjectsItemFormData) => {
    if (!formData.max_project_size) {
      return;
    }

    const maxProjectSize = parseInt(formData.max_project_size, 10);

    internalApiService.adminUpdateProject(project.id, {
      max_project_size: maxProjectSize,
    }).then(() => {
      if (onSubmit) {
        onSubmit();
      }
    });
  }, [project, onSubmit]);

  return (
    <Form
      onSubmit={handleSubmit(onFormSubmit)}
      id="project_edit"
    >
      <FormField
        id="max_project_size"
        error={errors.max_project_size && 'This field is required'}
        style={{ margin: '0' }}
      >
        <FormLabel>
          Project Size Limit
        </FormLabel>
        <FormInput
          {...form.register('max_project_size', {
            required: true,
          })}
          type="number"
          placeholder="Project size limit"
        />
        {!!maxProjectSizeValueInt && (
          <Text
            appearance="secondary"
          >
            {mbAsGB(maxProjectSizeValueInt)}
            {' GB'}
          </Text>
        )}
      </FormField>
    </Form>
  );
};
