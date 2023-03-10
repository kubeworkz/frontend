import React from 'react';
import { Tabs } from '#shared/components/Tabs/Tabs';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import {
  SNIPPET_TYPE_OPTIONS,
  SnippetConnectionData,
  SnippetsOrder,
  SnippetType,
  Snippet,
} from '#shared/components/Snippet/Snippet';

interface ProjectConnectionWidgetSnippetsProps {
  connectionData: SnippetConnectionData
}

export const ProjectConnectionWidgetSnippets = ({
  connectionData,
}: ProjectConnectionWidgetSnippetsProps) => {
  const { trackUiInteraction } = useAnalytics();
  const [type, setType] = React.useState(SnippetsOrder[0]);

  const encoded: SnippetConnectionData = React.useMemo(() => {
    const res: SnippetConnectionData = { ...connectionData };

    if (connectionData.role) {
      res.role = encodeURIComponent(connectionData.role);
    }

    if (connectionData.database) {
      res.database = encodeURIComponent(connectionData.database);
    }
    return res;
  }, [connectionData]);

  const onChangeTab = React.useCallback((t: SnippetType) => {
    trackUiInteraction(AnalyticsAction.CodeSamplesSampleTypeClicked);
    setType(t);
  }, []);

  return (
    <>
      <Tabs<SnippetType>
        options={SNIPPET_TYPE_OPTIONS}
        value={type}
        onChange={onChangeTab}
      />
      <Snippet
        connectionData={encoded}
        type={type}
        onCopy={() => trackUiInteraction(AnalyticsAction.CodeSamplesCopied)}
      />
    </>
  );
};
