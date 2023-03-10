import React, { useCallback } from 'react';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';
import { SettingsDesc } from '#shared/components/Settings/Settings';
import { CodeBlock } from '#shared/components/Code/Code';
import { useProjectsItemContext } from '../../../hooks/projectsItem';

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
