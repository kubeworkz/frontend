import React, { useState } from 'react';
import { DataTable, DataTableProps } from '#shared/components/DataTable/DataTable';
import { Branch } from '#api_client/generated/api_public_v2';
import { formatDate } from '#shared/utils/formatDate';
import { generatePath, useHistory } from 'react-router-dom';
import { ConsoleRoutes, CONSOLE_BASE_ROUTE } from '#shared/routes';
import Highlighter from 'react-highlight-words';
import { SearchField } from '#shared/components/SearchField/SearchField';
import { useBranches } from '#shared/hooks/projectBranches';
import { DataTableFilters } from '#shared/components/DataTable/DataTableFilters/DataTableFilters';
import { PageError } from '#shared/components/PageError/PageError';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { BranchPrimaryBadgeConditional } from '#shared/components/BranchPrimaryBadgeConditional/BranchPrimaryBadgeConditional';
import { BranchCreateButton } from '../../components/CreateButton/BranchCreateButton/BranchCreateButton';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { BranchEndpointStatus } from '../../components/BranchEndpointStatus/BranchEndpointStatus';
import { BranchUsedSize } from '../../components/BranchSize/BranchSize';

import styles from './ProjectBranches.module.css';

export const ProjectBranches = React.memo(() => {
  const { trackUiInteraction } = useAnalytics();
  const { projectId, project } = useProjectsItemContext();
  const {
    branches, branchesById, isLoading, error,
  } = useBranches();

  const history = useHistory();

  const [searchValue, setSearchValue] = useState('');

  const cols: DataTableProps<Branch>['cols'] = React.useMemo(() => ([
    {
      label: 'Branch',
      key: 'name',
      renderValue: (b, searchWords) => (
        <b>
          <Highlighter
            searchWords={searchWords}
            textToHighlight={b.name}
          />
          <BranchPrimaryBadgeConditional branch={b} />
        </b>
      ),
    },
    {
      label: 'Parent',
      key: 'parent_id',
      renderValue: (b) => <b>{b.parent_id ? branchesById[b.parent_id]?.name : '-'}</b>,
      tdAttrs: {
        width: '180px',
      },
    }, {
      label: 'Compute endpoint',
      key: 'endpoint_status',
      renderValue: (b) => (<BranchEndpointStatus branchId={b.id} />),
      tdAttrs: {
        width: '180px',
      },
    }, {
      label: 'Used space',
      key: 'logical_size',
      renderValue: (b) => (<BranchUsedSize branch={b} project={project} />),
      tdAttrs: {
        width: '180px',
      },
    }, {
      label: 'Created',
      key: 'created_at',
      renderValue: (b) => formatDate(b.created_at),
      tdAttrs: {
        width: '180px',
      },
    },
  ]), [project]);

  const onRowClick = React.useCallback((b, e) => {
    const path = generatePath(
      ConsoleRoutes.ProjectsItemBranchesItem,
      { branchId: b.id, projectId },
    );

    if (e.metaKey || e.ctrlKey) {
      trackUiInteraction(AnalyticsAction.BranchListRowClickedWithCtrlOrMeta);
      window.open(CONSOLE_BASE_ROUTE + path + window.location.search, '');
      return;
    }

    trackUiInteraction(AnalyticsAction.BranchListRowClicked);
    history.push(path + window.location.search);
  }, []);

  const filtered: [Branch[], string] = React.useMemo(() => {
    if (isLoading) {
      return [[], ''];
    }

    if (!searchValue) {
      return [branches, ''];
    }

    return [branches.filter((branch) => (
      branch.name.toLowerCase().indexOf(searchValue) !== -1
    )), searchValue];
  }, [searchValue, branches, isLoading]);

  if (error) {
    return (
      <PageError
        title={error}
      />
    );
  }

  return (
    <>
      <DataTableFilters>
        <SearchField
          className={styles.search}
          onChange={setSearchValue}
        />
        <div className={styles.createBranchButton}>
          <BranchCreateButton />
        </div>
      </DataTableFilters>
      <DataTable<Branch>
        isLoading={isLoading}
        cols={cols}
        data={isLoading ? [] : filtered[0]}
        searchWords={[filtered[1]]}
        onRowClick={onRowClick}
      />
    </>
  );
});

ProjectBranches.displayName = 'ProjectBranches';
