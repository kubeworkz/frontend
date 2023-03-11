import React from 'react';
import { generatePath, Link } from 'react-router-dom';

import { Text } from '../../components/Text/Text';
import {
  internalApiService, AdminGetOperationsParams, AdminOperation, OperationAction,
} from '../../api/internal';
import { CopyButton } from '../../components/CopyButton/CopyButton';
import { DateTimeFormat, formatDate } from '../../utils/formatDate';
import {
  OperationStatusBadge,
} from '../../components/OperationStatusBadge/OperationStatusBadge';
import Highlighter from 'react-highlight-words';
import { formatOpDuration } from '../../utils/units';
import { AdminRoutes } from '../../admin/config/routes';
import { AdminAppProps } from '../AdminApp/types';
import { createOpsLogsUrl, GrafanaLink } from '../GrafanaLink/GrafanaLink';
import { DataPage } from '../DataPage/DataPage';
import {
  ACTIONS_OPTIONS,
  OperationsListFilters,
} from './OperationsListFilters';

import './OperationsList.css';

export const OperationsList = ({ grafana, consoleEnv }: AdminAppProps) => {
  const getOperations = React.useCallback((options: AdminGetOperationsParams) => internalApiService
    .adminGetOperations(options)
    .then(({ data: responseData }) => responseData), []);

  const cols = React.useMemo(() => ([
    {
      label: 'ID',
      key: 'id',
      renderValue: (o: AdminOperation) => (
        <div style={{ display: 'flex' }}>
          <Text
            as={Link}
            to={generatePath(AdminRoutes.OperationsItem, { operationId: o.id.toString() })}
          >
            {o.id.substring(0, 8)}
          </Text>
          <span style={{ marginLeft: '8px' }}>
            <CopyButton text={o.id} />
          </span>
        </div>
      ),
    },
    {
      label: 'Executor ID',
      key: 'executor_id',
    },
    {
      label: 'Created at',
      key: 'created_at',
      sortable: true,
      renderValue: (o: AdminOperation) => (
        <Text appearance="secondary">{formatDate(o.created_at, DateTimeFormat.AdminDefault)}</Text>
      ),
    },
    {
      label: 'Updated at',
      key: 'updated_at',
      sortable: true,
      renderValue: (o: AdminOperation) => (
        <Text appearance="secondary">{formatDate(o.updated_at, DateTimeFormat.AdminDefault)}</Text>
      ),
    },
    {
      label: 'Project',
      key: 'project_id',
      renderValue: (o: AdminOperation, search: string[]) => (
        <Text
          as={Link}
          to={generatePath(AdminRoutes.ProjectsItem, { projectId: o.project_id.toString() })}
        >
          <Highlighter
            textToHighlight={o.project_id}
            searchWords={search}
          />
        </Text>
      ),
    },
    {
      label: 'Branch',
      key: 'branch_id',
      renderValue: (o: AdminOperation, search: string[]) => (
        !!o.branch_id && (
          <Text
            as={Link}
            to={generatePath(AdminRoutes.BranchesItem, { branchId: o.branch_id?.toString() })}
          >
            <Highlighter
              textToHighlight={o.branch_id?.toString()}
              searchWords={search}
            />
          </Text>
        )
      ),
    },
    {
      label: 'Endpoint',
      key: 'endpoint_id',
      renderValue: (o: AdminOperation, search: string[]) => (
        !!o.endpoint_id && (
          <Text
            as={Link}
            to={generatePath(AdminRoutes.EndpointsItem, { endpointId: o.endpoint_id?.toString() })}
          >
            <Highlighter
              textToHighlight={o.endpoint_id?.toString()}
              searchWords={search}
            />
          </Text>
        )
      ),
    },
    {
      label: 'Action',
      key: 'action',
      sortable: true,
    },
    {
      label: 'Status',
      key: 'status',
      sortable: true,
      renderValue: (o: AdminOperation) => (
        <OperationStatusBadge
          status={o.status}
        />
      ),
    },
    {
      label: 'Failures Count',
      key: 'failures_count',
      sortable: true,
    },
    {
      label: 'Duration',
      key: 'duration',
      renderValue: (o: AdminOperation) => (
        <Text appearance="secondary">{formatOpDuration(o)}</Text>
      ),
    },
    {
      label: 'Attempt duration',
      key: 'attempt_duration_ms',
      sortable: true,
      renderValue: (o: AdminOperation) => (
        !!o.attempt_duration_ms && (
          <Text appearance="secondary">
            {Math.round((o.attempt_duration_ms / 1000) * 100) / 100}
            {' '}
            s
          </Text>
        )
      ),
    },
    {
      label: 'Retry at',
      key: 'retry_at',
      renderValue: (o: AdminOperation) => (
        !!o.retry_at && (
          <Text appearance="secondary">{formatDate(o.retry_at, DateTimeFormat.AdminDefault)}</Text>
        )
      ),
    },
    {
      label: '',
      key: 'actions',
      renderValue: (o: AdminOperation) => (
        <GrafanaLink href={createOpsLogsUrl(grafana, consoleEnv, o)}>
          Logs
        </GrafanaLink>
      ),
    },
    {
      label: 'Error',
      key: 'error',
    },
  ]), []);

  return (
    <>
      <DataPage
        title="Operations"
        get={getOperations}
        pageLimit={50}
        tableProps={{
          cols,
        }}
        filtersComponent={OperationsListFilters}
        getInitialFilters={(filtersFromQuery) => ({
          action: ACTIONS_OPTIONS.filter(
            (o) => (o.value !== OperationAction.CheckAvailability),
          ).map((opt) => opt.value).join(','),
          ...filtersFromQuery,
        })}
        defaultSort={{
          sort: 'updated_at',
          order: 'desc',
        }}
      />
    </>
  );
};
