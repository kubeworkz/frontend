import React, { createRef, useCallback } from 'react';
import { generatePath, Link } from 'react-router-dom';

import {
  internalApiService, AdminGetEndpointsParams, AdminEndpoint,
} from '#api_client/internal';
import { Text } from '#shared/components/Text/Text';
import { AdminEndpointStatusBadge } from '#shared/components/AdminProjectStatusBadge/AdminProjectStatusBadge';
import { DateTimeFormat, formatDate } from '#shared/utils/formatDate';
import { AdminRoutes } from '../../config/routes';
import { DataPage, DataPageRef } from '../DataPage/DataPage';
import { EndpointsFilter } from './EndpointsFilter';

export const EndpointsList = () => {
  const dataPageRef = createRef<DataPageRef>();

  const getEndpoints = useCallback(
    (params: AdminGetEndpointsParams) => internalApiService
      .adminGetEndpoints(params)
      .then(({ data }) => data),
    [],
  );

  const cols = React.useMemo(() => ([
    {
      label: 'Id',
      key: 'id',
      sortable: true,
      renderValue: ({ id = '' }: AdminEndpoint) => (
        <Text
          as={Link}
          to={generatePath(AdminRoutes.EndpointsItem, { endpointId: id.toString() })}
        >
          {id}
        </Text>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      renderValue: (e: AdminEndpoint) => (
        <AdminEndpointStatusBadge endpoint={e} />
      ),
    },
    {
      label: 'Branch',
      key: 'branch_id',
      renderValue: ({ branch_id = '' }: AdminEndpoint) => (
        <Text
          as={Link}
          to={generatePath(AdminRoutes.BranchesItem, { branchId: branch_id.toString() })}
        >
          {branch_id}
        </Text>
      ),
    },
    {
      label: 'Project',
      key: 'project',
      renderValue: ({ project_id: projectId = '' }: AdminEndpoint) => (
        <Text
          as={Link}
          to={generatePath(AdminRoutes.ProjectsItem, { projectId: projectId.toString() })}
        >
          {projectId}
        </Text>
      ),
    },
    {
      label: 'Created at',
      key: 'created_at',
      sortable: true,
      renderValue: (c: AdminEndpoint) => (
        <Text appearance="secondary">{formatDate(c.created_at ?? '', DateTimeFormat.AdminDefault)}</Text>
      ),
    },
    {
      label: 'Updated at',
      key: 'updated_at',
      sortable: true,
      renderValue: (c: AdminEndpoint) => (
        <Text appearance="secondary">{formatDate(c.updated_at ?? '', DateTimeFormat.AdminDefault)}</Text>
      ),
    },
    {
      label: '',
      key: 'actions',
      renderValue: (c: AdminEndpoint) => (
        <Text
          as={Link}
          to={`${AdminRoutes.OperationsList}?endpoint_id=${c.id}`}
        >
          operations
        </Text>
      ),
    },
  ]), []);

  return (
    <>
      <DataPage
        title="Endpoints"
        get={getEndpoints}
        filtersComponent={EndpointsFilter}
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
