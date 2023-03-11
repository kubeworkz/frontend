import React from 'react';
import {
  FormSelect,
  FormSelectProps,
  useUpdateValueOnOptionsChangeEffect,
} from '../../components/Form/FormSelect/FormSelect';
import { Database } from '../../api/publicv2';
import { Option } from 'react-select/src/filters';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { BranchScopeProps } from '../../types/Props';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';
import {
  DatabaseOption,
  useProjectDatabases,
  useProjectDatabasesState,
} from '../../app/hooks/projectDatabases';
import { DatabaseFormModal } from '../DatabaseForm/DatabaseFormModal';
import { useSelectedBranch } from '../../app/hooks/selectedBranchProvider';

interface CreateOption extends Option {
  label: string;
  create: true;
}

type DatabaseSelectOption = DatabaseOption & { create?: boolean } | CreateOption;

interface DatabaseSelectProps
  extends FormSelectProps<DatabaseOption> {
  canCreateDatabase?: boolean;
  onCreateDatabase?: (db: Database) => void;
}

export const DatabaseSelectStateless = React.forwardRef(({
  projectId,
  branchId,
  canCreateDatabase = true,
  onCreateDatabase,
  ...props
}: DatabaseSelectProps & BranchScopeProps, ref) => {
  const { trackUiInteraction } = useAnalytics();
  const [formIsVisible, setFormIsVisible] = React.useState(false);

  const dbOptions = React.useMemo(() => {
    if (!canCreateDatabase) {
      return props.options;
    }

    return [
      {
        value: -1,
        create: true,
        label: 'Create new database',
      },
      ...(props.options || []),
    ];
  }, [props.options, canCreateDatabase]);

  const onChangeDatabase = (o: DatabaseSelectOption, meta?: any) => {
    if (!o && props.isClearable && props.onChange) {
      trackUiInteraction(AnalyticsAction.DatabaseSelectValueChanged);
      props.onChange(null, meta);
    } else if (o && o.create && canCreateDatabase) {
      trackUiInteraction(AnalyticsAction.DatabaseSelectNewDatabaseClicked);
      setFormIsVisible(true);
    } else if (o && !o.create && props.onChange) {
      trackUiInteraction(AnalyticsAction.DatabaseSelectValueChanged);
      props.onChange(o as DatabaseOption, meta);
    }
  };

  const closeModal = React.useCallback(() => setFormIsVisible(false), []);

  const handleDatabaseCreate = React.useCallback((db: Database) => {
    const opt = {
      value: db.name,
      label: db.name,
      database: db,
    };
    onChangeDatabase(opt);
    if (onCreateDatabase) {
      onCreateDatabase(db);
    }
    closeModal();
  }, [onChangeDatabase, onCreateDatabase]);

  useUpdateValueOnOptionsChangeEffect(props, (o1, o2) => (
    o1 && o2
    && o1.database.branch_id === o2.database.branch_id
    && o1.database.name === o2.database.name));

  // todo: fix the databaseForm to have projectId & branchId as props
  return (
    <>
      <DatabaseFormModal
        isOpen={formIsVisible}
        onRequestClose={closeModal}
        formProps={{
          onSuccess: handleDatabaseCreate,
        }}
      />
      <FormSelect
        {...ref}
        {...props}
        options={dbOptions}
        placeholder={props.isLoading ? 'Loading...' : 'Select database...'}
        onChange={onChangeDatabase}
      />
    </>
  );
});
DatabaseSelectStateless.displayName = 'DatabaseSelectStateless';

interface ProjectBranchDatabaseSelectProps extends DatabaseSelectProps {
  projectId: string;
  branchId?: string;
}

export const DatabaseSelectStateful = React.forwardRef(({
  projectId,
  branchId,
  ...props
}: ProjectBranchDatabaseSelectProps & BranchScopeProps, ref) => {
  const { data, isLoading, fetch } = useProjectDatabasesState({
    branchId,
    projectId,
  });

  return (
    <DatabaseSelectStateless
      ref={ref}
      {...props}
      isLoading={isLoading}
      projectId={projectId}
      branchId={branchId}
      options={data.selectOptions}
      onCreateDatabase={fetch}
    />
  );
});

DatabaseSelectStateful.displayName = 'DatabaseSelectStateful';

// todo: rename and move to the databaseContext?
export const DatabaseSelect = React.forwardRef((
  props: DatabaseSelectProps,
  ref,
) => {
  const { projectId } = useProjectsItemContext();
  const {
    selectOptions: databases,
    isLoading,
    fetch: updateDbs,
  } = useProjectDatabases();
  const { branch } = useSelectedBranch();

  React.useEffect(() => {
    updateDbs();
  }, [
    projectId,
    branch?.id,
  ]);

  return (
    <DatabaseSelectStateless
      ref={ref}
      {...props}
      projectId={projectId}
      branchId={branch?.id}
      options={databases}
      isLoading={isLoading}
      onCreateDatabase={updateDbs}
    />
  );
});

DatabaseSelect.displayName = 'DatabaseSelect';
