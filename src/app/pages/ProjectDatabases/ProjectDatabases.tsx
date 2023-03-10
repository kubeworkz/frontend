import React from 'react';
import { DataTable } from '../../../components/DataTable/DataTable';
import { Database } from '../../../api/publicv2';
import { IconButton } from '../../../components/Button/IconButton/IconButton';
import { BranchSelectOption, useBranches } from '../../../hooks/projectBranches';
import { useProjectDatabases } from '../../hooks/projectDatabases';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { DatabaseCreateButton } from '../../../components/CreateButton/DatabaseCreateButton/DatabaseCreateButton';
import { withDisableOnTransition } from '../../../components/withDisableOnTransition/withDisableOnTransition';
import { useSelectedBranch } from '../../hooks/selectedBranchProvider';
import { BranchSelect } from '../../../components/BranchSelect/BranchSelect';

import styles from './ProjectDatabases.module.css';

const TransitionIconButton = withDisableOnTransition(IconButton);

// todo: consider creating a component ProjectDatabasesComponent
//  which will accept all necessary information as props
//  and won't use context
export const ProjectDatabases = () => {
  const { projectId, isLoading: isProjectLoading } = useProjectsItemContext();
  const {
    list, isLoading: isDatabasesLoading, fetch, deleteDatabase,
  } = useProjectDatabases();
  const { branch, setBranch } = useSelectedBranch();
  const { selectOptionsById } = useBranches();

  const isLoading = isProjectLoading || isDatabasesLoading;

  React.useEffect(() => {
    fetch();
  }, [projectId, branch?.id]);

  const onClickDeleteDatabase = React.useCallback((db) => {
    deleteDatabase(db);
  }, [deleteDatabase]);

  const cols = React.useMemo(() => ([
    {
      key: 'name',
      label: 'Name',
      renderValue: (db: Database) => (
        <span
          data-qa="database_list_item_name"
          data-qa-databaseId={db.id}
        >
          {db.name}
        </span>
      ),
      tdAttrs: {
        style: {
          width: '50%',
        },
      },
    },
    {
      key: 'owner_name',
      label: 'Owner',
      tdAttrs: {
        style: {
          width: '300px',
          minWidth: '300px',
        },
      },
    },
    {
      key: 'actions',
      label: '',
      renderValue: (db: Database) => (
        <TransitionIconButton
          iconName="trash-bin_20"
          appearance="error"
          onClick={() => onClickDeleteDatabase(db)}
          data-qa="database_list_item_delete"
          data-qa-databaseId={db.id}
        />
      ),
      tdAttrs: {
        style: {
          width: '60px',
          minWidth: '60px',
        },
      },
    },
  ]), []);

  return (
    <>
      <div className={styles.row}>
        <BranchSelect
          showIcon
          className={styles.branchSelect}
          value={branch ? selectOptionsById[branch.id] : undefined}
          onChange={(b: BranchSelectOption | null) => b && setBranch(b.branch)}
        />
        <DatabaseCreateButton />
      </div>
      <DataTable
        cols={cols}
        data={list}
        isLoading={isLoading}
        keyField="name"
        keyPrefix={branch?.id}
        dataPlaceholderProps={{
          title: 'You don’t have any databases yet',
          actions: <DatabaseCreateButton />,
        }}
      />
    </>
  );
};
