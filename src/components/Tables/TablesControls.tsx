import React, { useMemo } from 'react';

import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';
import { FormSelect, SelectOption } from '#shared/components/Form/FormSelect/FormSelect';
import { BranchSelectOption, useBranches } from '#shared/hooks/projectBranches';

import { DatabaseSelect } from '../DatabaseSelect/DatabaseSelect';
import { useTables } from '../../pages/Tables/tablesContext';

import { BranchSelect } from '../BranchSelect/BranchSelect';
import { useSelectedBranch } from '../../hooks/selectedBranchProvider';
import styles from './Tables.module.css';

export const TablesControls = () => {
  const { selectOptionsById } = useBranches();
  const { branch, setBranch } = useSelectedBranch();
  const {
    selectedDatabase,
    schemas,
    isLoading,
    selectedSchema,
    onSelectDatabase,
    onSelectSchema,
  } = useTables();

  const schemaOptions = useMemo(
    () => schemas.map((name) => ({
      label: name,
      value: name,
    })),
    [schemas],
  );

  return (
    <div className={styles.tablesControls}>
      <FormField id="branch_select">
        <FormLabel>Branch:</FormLabel>
        <BranchSelect
          value={branch ? selectOptionsById[branch?.id] : undefined}
          onChange={(b: BranchSelectOption) => b && setBranch(b.branch)}
          disableBranchesWithoutEndpoints
        />
      </FormField>
      <FormField id="database_select">
        <FormLabel>Database:</FormLabel>
        <DatabaseSelect value={selectedDatabase} onChange={onSelectDatabase} />
      </FormField>
      <FormField id="schema_select">
        <FormLabel>Schema:</FormLabel>
        <FormSelect
          options={schemaOptions}
          isLoading={isLoading}
          defaultValue={{ label: selectedSchema, value: selectedSchema }}
          onChange={({ value }: SelectOption) => onSelectSchema(value)}
        />
      </FormField>
    </div>
  );
};
