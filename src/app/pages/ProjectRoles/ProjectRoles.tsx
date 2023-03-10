import React from 'react';
import { DataTable } from '../../../components/DataTable/DataTable';
import { Role } from '../../../api/publicv2';
import { IconButton } from '../../../components/Button/IconButton/IconButton';
import { Button } from '../../../components/Button/Button';
import { BranchSelectOption, useBranches } from '../../../hooks/projectBranches';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { useProjectRoles } from '../../hooks/projectRoles';
import { withDisableOnTransition } from '../../../components/withDisableOnTransition/withDisableOnTransition';
import { RoleCreateButton } from '../../../components/CreateButton/RoleCreateButton/RoleCreateButton';
import { ResetRolePassword } from '../../../components/ResetRolePassword/ResetRolePassword';

import { useSelectedBranch } from '../../hooks/selectedBranchProvider';
import { BranchSelect } from '../../../components/BranchSelect/BranchSelect';
import styles from './ProjectRoles.module.css';

const TransitionButton = withDisableOnTransition(Button);
const TransitionIconButton = withDisableOnTransition(IconButton);

// todo: consider creating a component ProjectRolesComponent
//  which will accept all necessary information as props
//  and won't use context
export const ProjectRoles = () => {
  const { projectId } = useProjectsItemContext();
  const {
    list, isLoading: isUsersLoading, fetch, deleteRole,
  } = useProjectRoles();
  const { branch, setBranch } = useSelectedBranch();
  const { selectOptionsById, isLoading: isBranchesLoading } = useBranches();

  const isLoading = isUsersLoading || isBranchesLoading;

  React.useEffect(() => {
    fetch();
  }, [projectId, branch?.id]);

  const cols = React.useMemo(() => ([
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'actions',
      label: '',
      renderValue: (r: Role) => (
        !r.protected && branch && (
          <div className={styles.actions}>
            <ResetRolePassword
              branch={branch}
              role={r}
            >
              {(onResetClick) => (
                <TransitionButton
                  onClick={onResetClick}
                  appearance="default"
                  className={styles.btn}
                >
                  Reset password
                </TransitionButton>
              )}
            </ResetRolePassword>
            <div className={styles.divider} />
            <TransitionIconButton
              iconName="trash-bin_20"
              appearance="error"
              onClick={() => deleteRole(r)}
              className={styles.btn}
            />
          </div>
        )
      ),
      tdAttrs: {
        width: '50px',
      },
    },
  ]), [branch]);

  return (
    <>
      <div className={styles.row}>
        <BranchSelect
          showIcon
          className={styles.branchSelect}
          value={branch ? selectOptionsById[branch.id] : undefined}
          onChange={(b: BranchSelectOption | null) => b && setBranch(b.branch)}
        />
        <RoleCreateButton />
      </div>
      <DataTable
        cols={cols}
        data={list}
        isLoading={isLoading}
        keyField="name"
        keyPrefix={branch?.id}
        dataPlaceholderProps={{
          title: 'You don’t have any roles yet',
          actions: <RoleCreateButton />,
        }}
      />
    </>
  );
};
