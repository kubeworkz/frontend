import React, { useCallback } from 'react';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { FormLabel } from '../../../components/Form/FormLabel/FormLabel';
import { SettingsDesc } from '../../../components/Settings/Settings';
import { CodeBlock } from '../../../components/Code/Code';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';

export const ProjectSettingsID = () => {
  const { projectId } = useProjectsItemContext();
  const { trackUiInteraction } = useAnalytics();
  const onCopy = useCallback(() => {
    trackUiInteraction(AnalyticsAction.ProjectSettingsProjectIdCopied);
  }, [trackUiInteraction]);

  return (
    <>
      <SettingsDesc>
        <FormLabel>Project ID</FormLabel>
        <CodeBlock
          data-qa="project-id"
          textToCopy={projectId}
          onCopy={onCopy}
        >
          {projectId}
        </CodeBlock>
      </SettingsDesc>
    </>
  );
};
