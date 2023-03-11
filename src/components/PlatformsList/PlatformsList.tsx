import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { DataTable } from '../../components/DataTable/DataTable';
import { Platform } from '../types';

import './PlatformsList.css';

interface PlatformsListProps {
  data: Platform[];
}

export const PlatformsList = ({ data: platforms }: PlatformsListProps) => (
  <>
    {platforms.map((platform) => (
      <div
        key={platform.handle}
        className="PlatformsListItem"
      >
        <PageHeader
          header={`${platform.name}. handle: ${platform.handle}`}
        />
        <DataTable
          keyField="handle"
          cols={[
            {
              label: 'ID',
              key: 'id',
              tdAttrs: {
                width: '10%',
              },
            },
            {
              label: 'Name',
              key: 'name',
            },
            {
              label: 'Handle',
              key: 'handle',
              tdAttrs: {
                width: '10%',
              },
            },
            {
              label: 'Default',
              key: 'default',
              renderValue(dataItem) {
                return dataItem.default ? 'yes' : 'no';
              },
              tdAttrs: {
                width: '10%',
              },
            },
          ]}
          data={[platform]}
        />
        <h3>Regions</h3>
        {(platform.regions && platform.regions.length)
          ? (
            <DataTable
              keyPrefix={`${platform.handle}_region_`}
              keyField="handle"
              cols={[
                {
                  label: 'ID',
                  key: 'id',
                  tdAttrs: {
                    width: '10%',
                  },
                },
                {
                  label: 'Name',
                  key: 'name',
                },
                {
                  label: 'Handle',
                  key: 'handle',
                  tdAttrs: {
                    width: '10%',
                  },
                },
                {
                  label: 'Default',
                  key: 'default',
                  renderValue(dataItem) {
                    return dataItem.default ? 'yes' : 'no';
                  },
                  tdAttrs: {
                    width: '10%',
                  },
                },
                {
                  label: 'Active',
                  key: 'active',
                  renderValue(dataItem) {
                    return String(dataItem.active);
                  },
                  tdAttrs: {
                    width: '10%',
                  },
                },
              ]}
              data={platform.regions}
            />
          ) : 'none'}
        <h3>Instance types</h3>
        {(platform.instance_types && platform.instance_types.length)
          ? (
            <DataTable
              keyPrefix={`${platform.handle}_it_`}
              keyField="handle"
              cols={[
                {
                  label: 'ID',
                  key: 'id',
                  tdAttrs: {
                    width: '10%',
                  },
                },
                {
                  label: 'Name',
                  key: 'name',
                },
                {
                  label: 'Handle',
                  key: 'handle',
                  tdAttrs: {
                    width: '10%',
                  },
                },
                {
                  label: 'Default',
                  key: 'default',
                  renderValue(dataItem) {
                    return dataItem.default ? 'yes' : 'no';
                  },
                  tdAttrs: {
                    width: '10%',
                  },
                },
              ]}
              data={platform.instance_types}
            />
          ) : 'none'}
      </div>
    ))}
  </>
);
