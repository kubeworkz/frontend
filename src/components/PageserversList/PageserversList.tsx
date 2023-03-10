import React from 'react';
import { generatePath, Link } from 'react-router-dom';

import { DataTableProps } from '#shared/components/DataTable/DataTable';
import { PageHeader } from '#shared/components/PageHeader/PageHeader';
import { Text } from '#shared/components/Text/Text';
import { DateTimeFormat, formatDate } from '#shared/utils/formatDate';
import { Pageserver } from '../types';
import { AdminRoutes } from '../../config/routes';
import { AdminDataTable } from '../AdminDataTable/AdminDataTable';

interface PageserversListProps
  extends DataTableProps<Pageserver> {}

export const PageserversList = (props: PageserversListProps) => (
  <>
    <PageHeader
      header="Pageservers"
    />
    <AdminDataTable
      {...props}
      cols={[
        {
          label: 'Id',
          key: 'id',
          sortable: true,
          renderValue: (p) => (
            <Text
              as={Link}
              to={generatePath(AdminRoutes.PageserversItem, { pageserverId: p.id })}
            >
              {p.id}
            </Text>
          ),
        },
        { label: 'Hostname', key: 'host', sortable: true },
        { label: 'Instance id', key: 'instance_id' },
        { label: 'Region id', key: 'region_id', sortable: true },
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
        { label: 'Active', key: 'active', renderValue: (p) => (String(p.active)) },
        {
          label: '',
          key: 'projects',
          renderValue: (p) => (
            <Text
              as={Link}
              to={`${AdminRoutes.ProjectsList}?pageserver_id=${p.id}`}
            >
              projects
            </Text>
          ),
        },
      ]}
    />
  </>
);
