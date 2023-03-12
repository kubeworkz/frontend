import { SettingsDesc, SettingsDivider } from '../../../components/Settings/Settings';
import { CenteredLoader } from '../../../components/Loader/Loader';
import { useCurrentUser } from '../../../hooks/currentUser';
import { Alert } from '../../../components/Alert/Alert';
import { ProjectSettingsName } from '../../../components/ProjectSettings/ProjectSettingsName/ProjectSettingsName';
import { ProjectSettingsDelete } from '../../../components/ProjectSettings/ProjectSettingsDelete/ProjectSettingsDelete';
import { ProjectSettingsID } from '../../../components/ProjectSettings/ProjectSettingsID/ProjectSettingsID';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { ProjectSettingsShare } from '../../../components/ProjectSettings/ProjectSettingsShare/ProjectSettingsShare';
import { useAppContext } from '../../hooks/app';

export const ProjectSettingsGeneral = () => {
  const { isFeatureEnabled } = useAppContext();
  const { isLoading, project } = useProjectsItemContext();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const isOwnProject = user && project && project.owner_id === user.id;

  if (isLoading || isUserLoading) {
    // todo: replace with proper skeleton when design is ready
    return <CenteredLoader />;
  }

  if (!user || !project) {
    return null;
  }

  return (
    <>
      {!isOwnProject
        && (
          <SettingsDesc>
            <Alert appearance="warning">
              You don&apos;t have enough rights to change project&apos;s name or delete the project.
              Only the project owner can do this.
            </Alert>
          </SettingsDesc>
        )}
      <ProjectSettingsID />
      <SettingsDivider />
      <ProjectSettingsName disabled={!isOwnProject} />
      {
        isFeatureEnabled('projectSharingUI') && isOwnProject
          && (
          <>
            <SettingsDivider />
            <ProjectSettingsShare />
          </>
          )
      }
      <SettingsDivider />
      <ProjectSettingsDelete disabled={!isOwnProject} />
    </>
  );
};
