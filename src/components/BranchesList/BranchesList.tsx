import React, { createRef, useCallback } from 'react';
import {
  internalApiService, AdminGetBranchesParams, AdminBranch,
} from '#api_client/internal';
import { Text } from '#shared/components/Text/Text';
import { generatePath, Link } from 'react-router-dom';
import { DateTimeFormat, formatDate } from '#shared/utils/formatDate';
import { humanReadableBytes } from '#shared/utils/units';
import { AdminRoutes } from '../../config/routes';
import { DataPage, DataPageRef } from '../DataPage/DataPage';
import { BranchesFilter } from './BranchesFilter';

export const BranchesList = () => {
  const dataPageRef = createRef<DataPageRef>();

  const getBranches = useCallback(
    (options: AdminGetBranchesParams) => internalApiService
      .adminGetBranches(options)
      .then(({ data }) => data),
    [],
  );

  const cols = React.useMemo(() => ([
    {
      label: 'Id',
      key: 'id',
      sortable: true,
      renderValue: ({ id = '' }: AdminBranch) => (
        <Text
          as={Link}
          to={generatePath(AdminRoutes.BranchesItem, { branchId: id.toString() })}
        >
          {id}
        </Text>
      ),
    },
    {
      label: 'Name',
      key: 'name',
    },
    {
      label: 'Project',
      key: 'project',
      renderValue: ({ project_id: projectId = '' }: AdminBranch) => (
        <Text
          as={Link}
          to={generatePath(AdminRoutes.ProjectsItem, { projectId: projectId.toString() })}
        >
          {projectId}
        </Text>
      ),
    },
    {
      label: 'Parent',
      key: 'parent',
      renderValue: ({ parent_id: parentId }: AdminBranch) => (
        <>
          {parentId ? (
            <Text
              as={Link}
              to={generatePath(AdminRoutes.BranchesItem, { branchId: parentId.toString() })}
            >
              {parentId}
            </Text>
          ) : (<Text appearance="secondary">-</Text>)}

        </>
      ),
    },
    {
      label: 'Logical size',
      key: 'logical_size',
      renderValue: (c: AdminBranch) => (
        <Text nowrap>{c.logical_size ? humanReadableBytes(c.logical_size) : '?'}</Text>
      ),
    },
    {
      label: 'Created at',
      key: 'created_at',
      renderValue: (c: AdminBranch) => (
        <Text appearance="secondary">{formatDate(c.created_at ?? '', DateTimeFormat.AdminDefault)}</Text>
      ),
    },
    {
      label: 'Updated at',
      key: 'updated_at',
      renderValue: (c: AdminBranch) => (
        <Text appearance="secondary">{formatDate(c.updated_at ?? '', DateTimeFormat.AdminDefault)}</Text>
      ),
    },
    {
      label: '',
      key: 'actions',
      renderValue: (c: AdminBranch) => (
        <Text
          as={Link}
          to={`${AdminRoutes.OperationsList}?branch_id=${c.id}`}
        >
          operations
        </Text>
      ),
    },
  ]), []);

  return (
    <>
      <DataPage
        title="Branches"
        get={getBranches}
        filtersComponent={BranchesFilter}
        tableProps={{
          cols,
        }}
        defaultSort={{
          sort: 'id',
          order: 'desc',
        }}
        ref={dataPageRef}
      />
    </>
  );
};
