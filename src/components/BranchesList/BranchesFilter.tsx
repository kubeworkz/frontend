import React, { useCallback } from 'react';

import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { Toggle } from '#shared/components/Toggle/Toggle';
import { ToggleButton } from '#shared/components/Toggle/ToggleButton/ToggleButton';
import { FormCheckbox } from '#shared/components/Form/FormCheckbox/FormCheckbox';

import { FilterComponentProps } from '../DataPage/DataPage';
import styles from './BranchesFilter.module.css';

type BranchesFiltersParams = {
  search?: string;
  project_id?: string;
  stuck?: string;
  show_deleted?: string;
};

export const BranchesFilter = ({
  value,
  onChange,
  disabled,
}: FilterComponentProps<BranchesFiltersParams>) => {
  const onChangeSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ search: event.target.value });
    },
    [onChange],
  );

  const onChangeProjectId = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ project_id: event.target.value });
    },
    [onChange],
  );

  return (
    <div className={styles.branchesFilter}>
      <FormField
        id="search_field"
        style={{ width: 300 }}
        className={styles.branchesFilterField}
      >
        <FormLabel>Branch id, name:</FormLabel>
        <FormInput
          disabled={disabled}
          onClear={() => onChange({ search: '' })}
          placeholder="Search"
          value={value.search}
          onChange={onChangeSearch}
        />
      </FormField>
      <FormField
        id="project_field"
        style={{ width: 300 }}
        className={styles.branchesFilterField}
      >
        <FormLabel>Project id:</FormLabel>
        <FormInput
          disabled={disabled}
          onClear={() => onChange({ project_id: '' })}
          placeholder="Project id"
          value={value.project_id}
          onChange={onChangeProjectId}
        />
      </FormField>
      <FormField
        id="stuck"
        className={styles.branchesFilterField}
      >
        <Toggle>
          <ToggleButton
            active={value.stuck !== 'true'}
            onClick={() => value.stuck === 'true' && onChange({ stuck: '' })}
            disabled={disabled}
          >
            All
          </ToggleButton>
          <ToggleButton
            active={value.stuck === 'true'}
            onClick={() => value.stuck !== 'true' && onChange({ stuck: 'true' })}
            disabled={disabled}
          >
            Stuck
          </ToggleButton>
        </Toggle>
      </FormField>
      <FormField
        id="deleted"
        label="Show deleted"
        className={styles.branchesFilterField}
        inline
      >
        <FormCheckbox
          id="show_deleted"
          disabled={disabled}
          checked={value.show_deleted === 'true'}
          onChange={(event) => onChange({ show_deleted: event.target.checked ? 'true' : '' })}
        />
      </FormField>
    </div>
  );
};
