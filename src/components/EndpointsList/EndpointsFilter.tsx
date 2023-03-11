import React, { useCallback } from 'react';

import { endpointStates } from '../../api/utils';
import { EndpointState } from '../../api/publicv2';
import { FormField } from '../../components/Form/FormField/FormField';
import { FormLabel } from '../../components/Form/FormLabel/FormLabel';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { findOption } from '../../components/Form/FormSelect/utils';

import { Toggle } from '../../components/Toggle/Toggle';
import { ToggleButton } from '../../components/Toggle/ToggleButton/ToggleButton';
import { FormCheckbox } from '../../components/Form/FormCheckbox/FormCheckbox';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { FilterComponentProps } from '../DataPage/DataPage';

import styles from './EndpointsFilter.module.css';

type ValidStateOption = {
  value: EndpointState;
  label: string;
};

type InvalidStateOption = {
  value: string;
  label: string;
};

type StateOption = ValidStateOption | InvalidStateOption;

const STATE_OPTIONS: Array<StateOption> = endpointStates.map((state) => ({
  value: state,
  label: state,
}));

type EndpointFilters = {
  search?: string;
  stuck?: string;
  show_deleted?: string;
  project_id?: string;
  branch_id?: string;
  current_state?: string;
  pending_state?: string;
};

export const EndpointsFilter = ({
  value,
  onChange,
  disabled,
}: FilterComponentProps<EndpointFilters>) => {
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

  const onChangeBranchId = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ branch_id: event.target.value });
    },
    [onChange],
  );
  const currentStateOption: StateOption | undefined = React.useMemo(
    () => findOption(STATE_OPTIONS, value.current_state),
    [value.current_state],
  );

  const pendingStateOption: StateOption | undefined = React.useMemo(
    () => findOption(STATE_OPTIONS, value.pending_state),
    [value.pending_state],
  );

  const showDeletedIgnored = React.useMemo(
    () => Boolean(currentStateOption || pendingStateOption),
    [currentStateOption, pendingStateOption],
  );

  return (
    <div className={styles.endpointsFilter}>
      <FormField
        id="search_field"
        style={{ width: 300 }}
        className={styles.endpointsFilterField}
      >
        <FormLabel>Endpoint id:</FormLabel>
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
        className={styles.endpointsFilterField}
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
        id="branch_field"
        style={{ width: 300 }}
        className={styles.endpointsFilterField}
      >
        <FormLabel>Branch id:</FormLabel>
        <FormInput
          disabled={disabled}
          onClear={() => onChange({ branch_id: '' })}
          placeholder="Branch id"
          value={value.branch_id}
          onChange={onChangeBranchId}
        />
      </FormField>
      <FormField id="stuck" className={styles.endpointsFilterField}>
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
      <FormField id="current_state" className={styles.endpointsFilterField} style={{ width: 300 }}>
        <FormLabel>Current state:</FormLabel>
        <FormSelect
          placeholder="Current state"
          value={currentStateOption}
          options={STATE_OPTIONS}
          isClearable
          onChange={(o: StateOption | undefined) => onChange({ current_state: o ? o.value : '' })}
        />
      </FormField>
      <FormField id="pending_state" className={styles.endpointsFilterField} style={{ width: 300 }}>
        <FormLabel>Pending state:</FormLabel>
        <FormSelect
          isDisabled={disabled}
          placeholder="Pending state"
          value={pendingStateOption}
          options={STATE_OPTIONS}
          isClearable
          onChange={(o: StateOption | undefined) => onChange({ pending_state: o ? o.value : '' })}
        />
      </FormField>

      <FormField
        id="deleted"
        label="Show deleted"
        className={styles.endpointsFilterField}
        inline
      >
        <FormCheckbox
          id="show_deleted"
          disabled={disabled || showDeletedIgnored}
          checked={value.show_deleted === 'true'}
          onChange={(event) => onChange({ show_deleted: event.target.checked ? 'true' : '' })}
        />
      </FormField>
    </div>
  );
};
