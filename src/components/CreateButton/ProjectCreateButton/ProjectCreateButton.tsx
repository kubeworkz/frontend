import React, { useCallback } from 'react';
import { Tippy } from '#shared/components/Tippy/Tippy';
import { ButtonProps } from '#shared/components/Button/Button';
import { Project } from '#api_client/publicv2';
import { useCurrentUser } from '#shared/hooks/currentUser';
import { useSettings } from '#shared/hooks/settings';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { useProjectsContext } from '../../../hooks/projectsContext';
import { CreateButton } from '../CreateButton';

import { ProjectFormModal } from '../../ProjectFormModal/ProjectFormModal';

type ProjectCreateButtonProps = Partial<ButtonProps> & {
  onProjectCreate: (p: Project) => void
};

export const ProjectCreateButton = (
  { children, onProjectCreate, ...props }: ProjectCreateButtonProps,
) => {
  const { trackUiInteraction } = useAnalytics();
  const { flags: { projectCreationForbidden } } = useSettings();
  const { userProjectsLimitsExceeded, owned: list } = useProjectsContext();
  const { user: { projectsLimit } } = useCurrentUser();

  const [showProjectCreateForm, setShowProjectCreateForm] = React.useState(false);

  const tooltip = React.useMemo(
    () => {
      if (projectCreationForbidden) {
        return "Sorry, you can't create projects for now";
      }

      const projectsCount = list.length;

      if (typeof projectsLimit !== 'number' || projectsLimit === -1) {
        return undefined;
      }
      if (projectsLimit > projectsCount) {
        const diff = projectsLimit - projectsCount;
        return `You can create ${diff} more project${diff > 1 ? 's' : ''}`;
      }
      return 'You can not create any more projects for now';
    },
    [projectsLimit, list, projectCreationForbidden],
  );

  const isButtonDisabled = React.useMemo(() => (
    userProjectsLimitsExceeded || projectCreationForbidden
  ), [userProjectsLimitsExceeded, projectCreationForbidden]);

  const onClickCreateButton = useCallback(() => {
    trackUiInteraction(AnalyticsAction.CreateProjectButtonClicked);
    setShowProjectCreateForm(true);
  }, []);

  const onClickCloseForm = () => {
    trackUiInteraction(AnalyticsAction.ProjectFormDismissed);
    setShowProjectCreateForm(false);
  };

  return (
    <>
      <ProjectFormModal
        isOpen={showProjectCreateForm}
        onRequestClose={onClickCloseForm}
      />
      <Tippy
        content={tooltip}
        placement="bottom"
        disabled={!tooltip}
      >
        <div style={{ display: 'inline-block' }}>
          <CreateButton
            {...props}
            disabled={isButtonDisabled}
            onClick={onClickCreateButton}
            data-qa="project_create_button"
          >
            {
              children
                || (
                <>
                  New Project
                  {!projectCreationForbidden && typeof projectsLimit === 'number' && projectsLimit >= 0 && (
                    ` (${list.length}/${projectsLimit})`
                  )}
                </>
                )
            }
          </CreateButton>
        </div>
      </Tippy>
    </>
  );
};
