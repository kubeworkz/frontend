import React from 'react';
import { SettingsSection } from '../../../components/Settings/Settings';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';
import { ShareProjectForm } from '../../ShareProjectForm/ShareProjectForm';

export const ProjectSettingsShare = () => {
  const { projectId } = useProjectsItemContext();

  return (
    <SettingsSection>
      <ShareProjectForm projectId={projectId} />
    </SettingsSection>
  );
};
