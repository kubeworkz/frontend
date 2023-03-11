import React, { forwardRef } from 'react';
import {
  FormSelect,
  FormSelectProps,
  useUpdateValueOnOptionsChangeEffect,
} from '../../components/Form/FormSelect/FormSelect';
import { apiService, Role } from '../../api/publicv2';
import { Option } from 'react-select/src/filters';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { BranchScopeProps } from '../../types/Props';
import { apiErrorToaster } from '../../api/utils';
import { useNewItemsCallbacks } from '../../hooks/useNewItem';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';
import { RoleOption, useProjectRoles, useProjectRolesState } from '../../app/hooks/projectRoles';
import { useSelectedBranch } from '../../app/hooks/selectedBranchProvider';

interface CreateOption extends Option {
  label: string;
  create: true;
}

type RoleSelectOption = RoleOption & { create?: boolean } | CreateOption;

interface RoleSelectProps extends FormSelectProps<RoleOption> {
  onAddUser?: (u: Role) => void;
  includeProtected?: boolean;
  canCreateRole?: boolean;
}

export const RoleSelectStateless = forwardRef(({
  projectId,
  branchId,
  onAddUser,
  includeProtected,
  ...props
}: RoleSelectProps & BranchScopeProps, ref) => {
  const { trackUiInteraction } = useAnalytics();
  const { onRoleCreate } = useNewItemsCallbacks();

  const [inputValue, setInputValue] = React.useState('');

  const filteredRoles = React.useMemo(
    () => (includeProtected ? props.options : props.options?.filter((r) => !r.role.protected)),
    [props.options, includeProtected],
  );

  useUpdateValueOnOptionsChangeEffect(
    {
      ...props,
      options: filteredRoles,
    },
    (o1: RoleOption, o2: RoleOption) => (
      o1.value === o2.value
      && o1.role.branch_id === o2.role.branch_id
    ),
  );

  const options = React.useMemo(() => (onAddUser ? [
    inputValue ? {
      value: '',
      create: true,
      label: `Add role '${inputValue}'`,
    } : {
      value: '',
      create: true,
      label: 'Type to add new role',
      disabled: true,
    },
    ...(filteredRoles || []),
  ] : filteredRoles), [filteredRoles, inputValue, onAddUser, includeProtected]);

  const onChange = (o: RoleSelectOption, meta: any) => {
    if (!o && props.isClearable && props.onChange) {
      trackUiInteraction(AnalyticsAction.UserSelectValueChanged);
      props.onChange(null, meta);
    } else if (o && o.create && onAddUser && branchId) {
      trackUiInteraction(AnalyticsAction.UserSelectNewUserClicked);
      apiService.createProjectBranchRole(projectId, branchId, {
        role: {
          name: inputValue,
        },
      }).then(({ data }) => {
        onRoleCreate(data);
        onAddUser(data.role);
        if (props.onChange) {
          props.onChange({
            value: data.role.name,
            label: data.role.name,
            role: data.role,
          } as RoleOption, meta);
        }
      }, apiErrorToaster);
    } else if (o.value !== 'create' && props.onChange) {
      trackUiInteraction(AnalyticsAction.UserSelectValueChanged);
      props.onChange(o as RoleOption, meta);
    }
  };

  return (
    <FormSelect
      {...ref}
      {...props}
      onInputChange={setInputValue}
      inputValue={inputValue}
      onChange={onChange}
      options={options}
      placeholder={props.isLoading ? 'Loading...' : 'Select role...'}
    />
  );
});
RoleSelectStateless.displayName = 'RoleSelectStateless';

export const RoleSelectStateful = forwardRef(({
  projectId,
  branchId,
  ...props
}: RoleSelectProps & BranchScopeProps, ref) => {
  const {
    data: { selectOptions }, isLoading, fetch,
  } = useProjectRolesState({
    projectId, branchId,
  });

  return (
    <RoleSelectStateless
      {...ref}
      {...props}
      options={selectOptions}
      projectId={projectId}
      branchId={branchId}
      isLoading={isLoading}
      onAddRole={(r: Role) => {
        fetch();
        if (props.onAddUser) {
          props.onAddUser(r);
        }
      }}
    />
  );
});
RoleSelectStateful.displayName = 'RoleSelectStateful';

export const RoleSelect = forwardRef((props: Omit<RoleSelectProps, 'projectId' | 'branchId'>, ref) => {
  const { projectId } = useProjectsItemContext();
  const { branch } = useSelectedBranch();
  const {
    selectOptions: roles, isLoading, fetch,
  } = useProjectRoles();

  return (
    <RoleSelectStateless
      {...ref}
      {...props}
      options={roles}
      projectId={projectId}
      branchId={branch?.id}
      isLoading={isLoading}
      onAddUser={props.canCreateRole ? (r: Role) => {
        fetch();
        if (props.onAddUser) {
          props.onAddUser(r);
        }
      } : undefined}
    />
  );
});
RoleSelect.displayName = 'RoleSelect';
RoleSelect.defaultProps = {
  canCreateRole: true,
};
