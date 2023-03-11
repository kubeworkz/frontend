import React from 'react';
import { generatePath, Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { DataTableProps } from '../../components/DataTable/DataTable';
import { Text } from '../../components/Text/Text';
import { DateTimeFormat, formatDate } from '../../utils/formatDate';
import { Safekeeper } from '../types';
import { AdminDataTable } from '../AdminDataTable/AdminDataTable';
import { AdminRoutes } from '../../admin/config/routes';

interface SafekeepersListProps
  extends DataTableProps<Safekeeper> {}

export const SafekeepersList = (props: SafekeepersListProps) => (
  <>
    <PageHeader
      header="Safekeepers"
    />
    <AdminDataTable
      {...props}
      cols={[
        {
          label: 'Id',
          key: 'id',
          sortable: true,
          renderValue: (c) => (
            <Text
              as={Link}
              to={generatePath(AdminRoutes.SafekeepersItem, { safekeeperId: c.id })}
            >
              {c.id}
            </Text>
          ),
        },
        { label: 'Hostname', key: 'host', sortable: true },
        { label: 'Instance id', key: 'instance_id' },
        {
          label: 'Region id',
          key: 'region_id',
          sortable: true,
        },
        { label: 'Availability Zone id', key: 'availability_zone_id' },
        { label: 'Version', key: 'version', sortable: true },
        {
          label: 'Created at',
          key: 'created_at',
          renderValue: (data) => (
            <Text appearance="secondary" nowrap>{formatDate(data.created_at, DateTimeFormat.AdminDefault)}</Text>
          ),
        },
        { label: 'Projects count', key: 'projects_count', sortable: true },
        { label: 'Active', key: 'active', renderValue: (c) => (String(c.active)) },
        {
          label: '',
          key: 'projects',
          renderValue: (c) => (
            <Text
              as={Link}
              to={{
                pathname: AdminRoutes.ProjectsList,
                search: `?safekeeper_id=${c.id}`,
              }}
            >
              projects
            </Text>
          ),
        },
      ]}
    />
  </>
);
