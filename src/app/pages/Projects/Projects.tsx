import React, { useCallback } from 'react';
import { generatePath, useHistory } from 'react-router-dom';

import { Project } from '#api_client/publicv2';
import { DataTable } from '#shared/components/DataTable/DataTable';
import { Text } from '#shared/components/Text/Text';
import { DataTableHeader } from '#shared/components/DataTable/DataTableHeader/DataTableHeader';
import { SettingsDesc, SettingsHeader } from '#shared/components/Settings/Settings';
import { formatDate } from '#shared/utils/formatDate';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { ConsoleRoutes, CONSOLE_BASE_ROUTE } from '#shared/routes';
import { usePlatforms } from '#shared/hooks/platforms';
import { humanReadableBytes } from '#shared/utils/units';
import { ProjectCreateButton } from '../../components/CreateButton/ProjectCreateButton/ProjectCreateButton';
import { useProjectsContext } from '../../hooks/projectsContext';
import { useAppCache } from '../../hooks/cache';
import { useAppContext } from '../../hooks/app';
import { ProjectActions } from '../../components/ProjectActions/ProjectActions';

import { NoProjectsPlaceholder } from '../../components/NoProjectsPlaceholder/NoProjectsPlaceholder';
import './Projects.css';

export const Projects = () => {
  const { isFeatureEnabled } = useAppContext();
  const { trackUiInteraction } = useAnalytics();
  const { getAppCache, setAppCache } = useAppCache();
  const {
    sharedWithMe,
    owned,
    list,
    isLoading,
  } = useProjectsContext();
  const history = useHistory();
  const { get } = useProjectsContext();
  const { getRegionSafe } = usePlatforms();

  const cols = React.useMemo(() => ([
    {
      key: 'name',
      label: 'Name',
      renderValue: ({ name }: Project) => (
        <Text bold>{name}</Text>
      ),
    },
    {
      key: 'region_name',
      label: 'Region',
      renderValue: ({ platform_id, region_id }: Project) => (
        <Text>{getRegionSafe(platform_id, region_id)?.name}</Text>
      ),
    },
    {
      key: 'created_at',
      label: 'Created at',
      renderValue: ({ created_at }: Project) => (
        <Text
          appearance="secondary"
          nowrap
        >
          {formatDate(created_at)}
        </Text>
      ),
    },
    ...(isFeatureEnabled('syntheticStorageSizeUI') ? [{
      key: 'synthetic_storage_size',
      label: 'Storage',
      renderValue: ({ synthetic_storage_size }: Project) => (
        <Text
          nowrap
          bold
        >
          {synthetic_storage_size ? humanReadableBytes(synthetic_storage_size) : '-'}
        </Text>
      ),
    }] : []),
    {
      key: 'actions',
      label: '',
      renderValue: (project: Project) => <ProjectActions project={project} />,
      tdAttrs: {
        width: 50,
      },
    },
  ]), []);

  const onRowClick = React.useCallback(
    ({ id }: Project, e) => {
      const path = generatePath(ConsoleRoutes.ProjectsItem, { projectId: id });

      if (e.metaKey || e.ctrlKey) {
        trackUiInteraction(AnalyticsAction.ProjectListProjectOpenedNewTab);
        window.open(CONSOLE_BASE_ROUTE + path + window.location.search, '');
        return;
      }

      trackUiInteraction(AnalyticsAction.ProjectListProjectOpened);
      history.push(path + window.location.search);
    },
    [history],
  );

  const onProjectCreate = useCallback((p: Project) => {
    const appCache = getAppCache();
    setAppCache({ ...appCache, project: p });
    history.push(`${ConsoleRoutes.ProjectsItem.replace(
      ':projectId',
      p.id,
    )}`);
    get();
  }, []);

  if (!isLoading && !list.length) {
    return (
      <NoProjectsPlaceholder />
    );
  }

  return (
    <>
      <SettingsDesc>
        <DataTableHeader
          label="Projects"
          total={owned.length}
          rightColNode={<ProjectCreateButton onProjectCreate={onProjectCreate} />}
        />
        <DataTable<Project>
          isLoading={isLoading}
          cols={cols}
          data={isLoading ? [] : owned}
          onRowClick={onRowClick}
        />
      </SettingsDesc>
      { !!sharedWithMe.length
        && (
          <>
            <SettingsDesc>
              <SettingsHeader>Shared with me</SettingsHeader>
            </SettingsDesc>
            <SettingsDesc>
              <DataTable<Project>
                isLoading={isLoading}
                cols={cols}
                data={isLoading ? [] : sharedWithMe}
                onRowClick={onRowClick}
              />
            </SettingsDesc>
          </>
        )}
    </>
  );
};
