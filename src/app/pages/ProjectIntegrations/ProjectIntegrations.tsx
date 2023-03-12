/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import {
  ExternalIntegration,
  OAuthApplication,
} from '../../../api/publicv2';
import {
  SettingsHeader,
} from '../../../components/Settings/Settings';
import { Error } from '../../../components/Error/Error';
import {
  DataTable,
  DataTableColumn,
} from '../../../components/DataTable/DataTable';
import { createActionsCol } from '../../../components/DataTable/utils';

import { useProjectsItemContext } from '../../hooks/projectsItem';
import { ProjectIntegrationsProvider, useProjectIntegrations } from '../../hooks/projectIntegrations';
import { IntegrationActions } from './IntegrationActions';

const cols: DataTableColumn<OAuthApplication | ExternalIntegration>[] = [
  { key: 'name', label: 'Name', renderValue: (value) => value.name },
  createActionsCol((app) => <IntegrationActions app={app} />),
];

const ProjectIntegrationsC = () => {
  const { integrations, isLoading, error } = useProjectIntegrations();
  return (
    <>
      {error && (
        <Error
          title="Failed to load integrations"
          subtitle={error.message}
        />
      )}
      <>
        <SettingsHeader>Configured Integrations</SettingsHeader>
        <br />
        <DataTable
          cols={cols}
          data={integrations}
          isLoading={isLoading}
        />
      </>
    </>
  );
};

export const ProjectIntegrations = () => {
  const { projectId } = useProjectsItemContext();
  return (
    <ProjectIntegrationsProvider projectId={projectId}>
      <ProjectIntegrationsC />
    </ProjectIntegrationsProvider>
  );
};
