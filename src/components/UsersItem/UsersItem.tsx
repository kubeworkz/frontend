import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Text } from '../../components/Text/Text';
import { Link } from 'react-router-dom';
import { useConfirmation } from '../../components/Confirmation/ConfirmationProvider';
import { Button } from '../../components/Button/Button';
import { DataTable, DataTableColumn } from '../../components/DataTable/DataTable';
import { AdminUser, ConsumptionHistoryPeriod } from '../../api/generated/api';
import { centsToDollars, humanReadableBytes, secondsToHours } from '../../utils/units';
import { AdminRoutes } from '../../admin/config/routes';
import { toggleAdmin } from '../../admin/utils/toggleAdmin';
import { ConfirmationPresets } from '../../admin/config/confirmationPresets';
import { UsersItemFormModal } from '../UsersItemForm/UsersItemFormModal';

interface UsersItemProps {
  user: AdminUser;
  consumption_history: ConsumptionHistoryPeriod[]
}

const columns: DataTableColumn<ConsumptionHistoryPeriod>[] = [
  {
    key: 'SubscriptionType',
    label: 'Type',
  }, {
    key: 'ActiveTime',
    label: 'Active Time, hours',
    renderValue: (value) => (
      (
        <Text title={value.ActiveTime.toString()}>
          {secondsToHours(value.ActiveTime)}
        </Text>
      )
    ),
  }, {
    key: 'ComputeTime',
    label: 'Compute Time, hours',
    renderValue: (value) => (
      (
        <Text title={value.ComputeTime.toString()}>
          {secondsToHours(value.ComputeTime)}
        </Text>
      )
    ),
  }, {
    key: 'ComputeTimeCost',
    label: 'Compute Time, USD',
    renderValue: (value) => (
      (
        <Text title={value.ComputeTimeCost.toString()}>
          {centsToDollars(value.ComputeTimeCost)}
        </Text>
      )
    ),
  }, {
    key: 'DataStorage',
    label: 'Data storage',
    renderValue: (value) => (
      (
        <Text title={value.DataStorage.toString()}>
          {humanReadableBytes(value.DataStorage)}
        </Text>
      )
    ),
  }, {
    key: 'DataStorageCost',
    label: 'Data storage, USD',
    renderValue: (value) => (
      (
        <Text title={value.DataStorageCost.toString()}>
          {centsToDollars(value.DataStorageCost)}
        </Text>
      )
    ),
  }, {
    key: 'DataTransfer',
    label: 'Data transfer',
    renderValue: (value) => (
      (
        <Text title={value.DataTransfer.toString()}>
          {humanReadableBytes(value.DataTransfer)}
        </Text>
      )
    ),
  }, {
    key: 'DataTransferCost',
    label: 'Data transfer, USD',
    renderValue: (value) => (
      (
        <Text title={value.DataTransferCost.toString()}>
          {centsToDollars(value.DataTransferCost)}
        </Text>
      )
    ),
  }, {
    key: 'WrittenSize',
    label: 'Written size',
    renderValue: (value) => (
      (
        <Text title={value.WrittenSize.toString()}>
          {humanReadableBytes(value.WrittenSize)}
        </Text>
      )
    ),
  }, {
    key: 'WrittenSizeCost',
    label: 'Written size, USD',
    renderValue: (value) => (
      (
        <Text title={value.WrittenSizeCost.toString()}>
          {centsToDollars(value.WrittenSizeCost)}
        </Text>
      )
    ),
  },
  {
    key: 'HubspotDealCreatedAt',
    label: 'Hubspot deal created at',
  },
  {
    key: 'HubspotDealNextUpdateAt',
    label: 'Hubspot deal next update at',
  },
  {
    key: 'HubspotDealClosedAt',
    label: 'Hubspot deal closed at',
  },
  {
    key: 'PeriodStart',
    label: 'Period start',
  }, {
    key: 'PeriodEnd',
    label: 'Period end',
  }, {
    key: 'UpdatedAt',
    label: 'Updated at',
  },
];

export const UsersItem = ({ user, consumption_history }: UsersItemProps) => {
  const { confirm } = useConfirmation();
  const [isEditing, setIsEditing] = React.useState(false);

  if (!user) {
    return null;
  }

  const onChangeAdmin = () => {
    const toggle = () => toggleAdmin(user, {
      onSuccess: () => window.location.reload(),
    });

    if (!user.admin) {
      return confirm(ConfirmationPresets.MakeUserAnAdmin).then(toggle);
    }
    return toggle();
  };

  return (
    <>
      {
        isEditing
          && (
          <UsersItemFormModal
            user={user}
            onDecline={() => setIsEditing(false)}
            onSubmit={() => {
              setIsEditing(false);
              window.location.reload();
            }}
          />
          )
      }
      <PageHeader
        header={`User id: ${user.id}`}
      />
      <table>
        <tbody>
          {Object.entries(user).map(([key, value]) => {
            if (key === 'admin') {
              return (
                <tr key={key}>
                  <th align="right">{key}</th>
                  <td>
                    {JSON.stringify(value)}
                    {' '}
                    <Text
                      as="button"
                      onClick={onChangeAdmin}
                      appearance="error"
                    >
                      {value ? 'Remove admin role' : 'Add admin role'}
                    </Text>
                  </td>
                </tr>
              );
            }

            if (key === 'settings_raw') {
              return (
                <tr key={key}>
                  <th align="right">{key}</th>
                  <td>
                    <Button
                      appearance="default"
                      onClick={() => setIsEditing(true)}
                    >
                      view or edit
                    </Button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={key}>
                <th align="right">{key}</th>
                <td>
                  {typeof value === 'string' ? value : (
                    <pre>{JSON.stringify(value, null, '  ')}</pre>)}

                </td>
              </tr>
            );
          })}
          <tr>
            <th />
            <td>
              <Text as={Link} to={`${AdminRoutes.ProjectsList}?user_id=${user.id}`}>Projects</Text>
            </td>
          </tr>
        </tbody>
      </table>
      <span>Consumption history</span>
      <DataTable cols={columns} data={consumption_history} />
    </>
  );
};
