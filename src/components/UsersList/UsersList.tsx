import React, { createRef } from 'react';
import { AdminGetUsersParams, AdminUser } from '../../api/generated/api';
import { internalApiService } from '../../api/internal';
import { Text } from '../../components/Text/Text';
import { generatePath, Link } from 'react-router-dom';
import { DateTimeFormat, formatDate } from '../../utils/formatDate';
import { ActionsDropdown } from '../../components/ActionsDropdown/ActionsDropdown';
import { ActionsDropdownItem } from '../../components/ActionsDropdown/ActionDropdownItem/ActionsDropdownItem';
import { Badge } from '../../components/Badge/Badge';
import { useConfirmation } from '../../components/Confirmation/ConfirmationProvider';
import { CopyButton } from '../../components/CopyButton/CopyButton';
import _ from 'lodash';
import { DataTableProps } from '../../components/DataTable/DataTable';
import { User } from '../types';
import { UsersItemFormModal } from '../UsersItemForm/UsersItemFormModal';
import { ConfirmationPresets } from '../../admin/config/confirmationPresets';
import { toggleAdmin } from '../../admin/utils/toggleAdmin';
import { AdminRoutes } from '../../admin/config/routes';
import { DataPage, DataPageRef } from '../DataPage/DataPage';
import { UsersListFilters } from './UsersListFilters';

export const UsersList = () => {
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { confirm } = useConfirmation();

  const closeEditUser = React.useCallback(() => setEditingUser(null), []);

  const dataPageRef = createRef<DataPageRef>();

  const getUsers = React.useCallback(
    (options: AdminGetUsersParams) => (
      internalApiService
        .adminGetUsers(options)
        .then(({ data }) => (data))
    ),
    [],
  );

  const onChangeAdmin = (user: User) => {
    const toggle = () => toggleAdmin(user, {
      onSuccess: () => {
        dataPageRef.current?.fetch();
      },
    });

    if (!user.admin) {
      return confirm(ConfirmationPresets.MakeUserAnAdmin).then(toggle);
    }

    return toggle();
  };

  const cols: DataTableProps<AdminUser>['cols'] = React.useMemo(() => ([
    {
      label: 'Id',
      key: 'id',
      sortable: true,
      renderValue: (user: AdminUser) => (
        <div style={{ display: 'flex' }}>
          <Text
            as={Link}
            to={generatePath(AdminRoutes.UsersItem, { userId: user.id.toString() })}
          >
            {user.id.substring(0, 8)}
          </Text>
          <CopyButton text={user.id} />
        </div>
      ),
    },
    {
      label: 'Email',
      key: 'email',
      sortable: true,
    },
    {
      label: 'Admin',
      key: 'admin',
      renderValue: (user: AdminUser) => (
        user.admin && <Badge appearance="success">Admin</Badge>
      ),
    },
    {
      label: 'Created at',
      key: 'created_at',
      renderValue: (user: AdminUser) => (
        <Text appearance="secondary" nowrap>{formatDate(user.created_at, DateTimeFormat.AdminDefault)}</Text>
      ),
      sortable: true,
    },
    {
      label: 'Name',
      key: 'name',
      sortable: true,
    },
    {
      label: 'Invite',
      key: 'invite',
    },
    {
      label: 'Projects limit',
      key: 'settings',
      renderValue: (user: AdminUser) => {
        const userLimits = _.get(user.settings_raw, 'limits.max_projects');
        const globalLimits = _.get(user.settings, 'limits.max_projects');

        if (typeof userLimits === 'number') {
          return (
            <Text
              as="span"
              title="applied from user settings"
            >
              {userLimits}
            </Text>
          );
        }
        if (typeof globalLimits === 'number') {
          return (
            <Text
              as="span"
              appearance="secondary"
              title="applied from global settings"
            >
              {globalLimits}
            </Text>
          );
        }

        return <Text appearance="secondary">unset</Text>;
      },
    },
    {
      label: 'Endpoints limit',
      key: 'endpoints settings',
      renderValue: (user: AdminUser) => {
        const userLimits = _.get(user.settings_raw, 'limits.max_endpoints');
        const globalLimits = _.get(user.settings, 'limits.max_endpoints');

        if (typeof userLimits === 'number') {
          return (
            <Text
              as="span"
              title="applied from user settings"
            >
              {userLimits}
            </Text>
          );
        }
        if (typeof globalLimits === 'number') {
          return (
            <Text
              as="span"
              appearance="secondary"
              title="applied from global settings"
            >
              {globalLimits}
            </Text>
          );
        }

        return <Text appearance="secondary">unset</Text>;
      },
    },
    {
      label: 'Branches limit',
      key: 'branches settings',
      renderValue: (user: AdminUser) => {
        const userLimits = _.get(user.settings_raw, 'limits.max_branches');
        const globalLimits = _.get(user.settings, 'limits.max_branches');

        if (typeof userLimits === 'number') {
          return (
            <Text
              as="span"
              title="applied from user settings"
            >
              {userLimits}
            </Text>
          );
        }
        if (typeof globalLimits === 'number') {
          return (
            <Text
              as="span"
              appearance="secondary"
              title="applied from global settings"
            >
              {globalLimits}
            </Text>
          );
        }

        return <Text appearance="secondary">unset</Text>;
      },
    },
    {
      label: '',
      key: 'projects',
      renderValue: (user: AdminUser) => (
        <Text
          as={Link}
          to={`${AdminRoutes.ProjectsList}?user_id=${user.id}`}
        >
          projects
        </Text>
      ),
    },
    {
      label: '',
      key: 'actions',
      renderValue: (user: AdminUser) => (
        <ActionsDropdown>
          <ActionsDropdownItem
            as="button"
            onClick={() => setEditingUser(user)}
          >
            settings
          </ActionsDropdownItem>
          <ActionsDropdownItem
            as="button"
            onClick={() => onChangeAdmin(user)}
          >
            {user.admin ? 'remove admin role' : 'add admin role'}
          </ActionsDropdownItem>
        </ActionsDropdown>
      ),
    },
  ]), []);

  return (
    <>
      {editingUser
      && (
        <UsersItemFormModal
          user={editingUser}
          onDecline={closeEditUser}
          onSubmit={() => {
            closeEditUser();
            dataPageRef.current?.fetch();
          }}
        />
      )}
      <DataPage
        title="Users"
        get={getUsers}
        tableProps={{
          cols,
        }}
        filtersComponent={UsersListFilters}
        defaultSort={{
          sort: 'created_at',
          order: 'desc',
        }}
        ref={dataPageRef}
      />
    </>
  );
};
