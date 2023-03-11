import React from 'react';
import { Moment } from 'moment';
import { FormField } from '../../components/Form/FormField/FormField';
import { FormLabel } from '../../components/Form/FormLabel/FormLabel';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { OperationAction, OperationStatus } from '../../api/internal';
import { DateTimeFormat } from '../../utils/formatDate';
import { findOption } from '../../components/Form/FormSelect/utils';
import { findOptions } from '../../components/Form/FormSelect/multiple';
import { FormDateTime } from '../../components/Form/FormDateTime/FormDateTime';
import { Toggle } from '../../components/Toggle/Toggle';
import { ToggleButton } from '../../components/Toggle/ToggleButton/ToggleButton';

import { FilterComponentProps } from '../DataPage/DataPage';

export interface StatusOption {
  label: string,
  value: OperationStatus,
}

export const STATUS_OPTIONS: Array<StatusOption> = Object.values(OperationStatus).map((status) => ({
  label: status,
  value: status,
}));

export interface ActionOption {
  label: string,
  value: OperationAction,
}

export const ACTIONS_OPTIONS: Array<ActionOption> = Object
  .values(OperationAction)
  .map((action) => ({
    label: action,
    value: action,
  }));

export interface HadRetriesOption {
  label: string,
  value: 'none' | 'some',
}

export const HAD_RETRIES_OPTIONS: Array<HadRetriesOption> = [
  {
    label: 'Without retries',
    value: 'none',
  },
  {
    label: 'With retries',
    value: 'some',
  },
];

export const DATE_FORMAT = DateTimeFormat.AdminFilter;
export const INVALID_DATE_TIME_FORMAT_ERR = 'Ivalid date format';

interface OperationsListFiltersProps extends FilterComponentProps<{
  search?: string;
  project_id?: string;
  branch_id?: string;
  endpoint_id?: string;
  status?: string;
  action?: string;
  had_retries?: string;
  date_from?: string;
  date_to?: string;
  stuck?: string;
}> {}

export const OperationsListFilters = ({
  value,
  onChange,
}: OperationsListFiltersProps) => {
  const createOnChangeDate = (field: 'date_from' | 'date_to') => (date: Moment | string) => {
    if (!date) {
      onChange({ [field]: '' });
      return;
    }
    if (typeof date === 'string') {
      return;
    }

    if (date.isValid()) {
      onChange({ [field]: date.format(DateTimeFormat.AdminQuery) });
    }
  };

  return (
    <>
      <div className="OperationsTopNav">
        <FormField id="project_id" className="OperationsTopNavItem OperationsTopNavItemWide">
          <FormLabel>Project id:</FormLabel>
          <FormInput
            value={value.project_id || ''}
            onChange={(e) => onChange({ project_id: e.target.value })}
            placeholder="Project Id"
          />
        </FormField>
        <FormField id="branch_id" className="OperationsTopNavItem OperationsTopNavItemWide">
          <FormLabel>Branch id:</FormLabel>
          <FormInput
            value={value.branch_id || ''}
            onChange={(e) => onChange({ branch_id: e.target.value })}
            placeholder="Branch Id"
          />
        </FormField>
        <FormField id="endpoint_id" className="OperationsTopNavItem OperationsTopNavItemWide">
          <FormLabel>Endpoint id:</FormLabel>
          <FormInput
            value={value.endpoint_id || ''}
            onChange={(e) => onChange({ endpoint_id: e.target.value })}
            placeholder="Endpoint Id"
          />
        </FormField>
        <FormField
          id="date_from"
          className="OperationsTopNavItem"
        >
          <FormLabel>Date from:</FormLabel>
          <FormDateTime
            onChange={createOnChangeDate('date_from')}
            initialValue={value.date_from}
            dateFormat={DateTimeFormat.AdminFilterDate}
            timeFormat={DateTimeFormat.AdminFilterTime}
            inputProps={{
              placeholder: `${DateTimeFormat.AdminFilterDate} ${DateTimeFormat.AdminFilterTime}`,
            }}
          />
        </FormField>
        <FormField
          id="date_to"
          className="OperationsTopNavItem"
        >
          <FormLabel>Date to:</FormLabel>
          <FormDateTime
            onChange={createOnChangeDate('date_to')}
            initialValue={value.date_to}
            dateFormat={DateTimeFormat.AdminFilterDate}
            timeFormat={DateTimeFormat.AdminFilterTime}
            inputProps={{
              placeholder: `${DateTimeFormat.AdminFilterDate} ${DateTimeFormat.AdminFilterTime}`,
            }}
          />
        </FormField>
      </div>
      <div className="OperationsTopNav">
        <FormField id="action" className="OperationsTopNavItem OperationsTopNavItemWide">
          <FormLabel>Action:</FormLabel>
          <FormSelect
            isMulti
            placeholder="Action"
            value={value.action ? findOptions(ACTIONS_OPTIONS, value.action) : undefined}
            options={ACTIONS_OPTIONS}
            onChange={(o: ActionOption[] | undefined) => onChange({ action: o ? o.map((item) => item.value).join(',') : '' })}
          />
        </FormField>
        <FormField id="status" className="OperationsTopNavItem">
          <FormLabel>Status:</FormLabel>
          <FormSelect
            placeholder="Status"
            value={findOption(STATUS_OPTIONS, value.status)}
            options={STATUS_OPTIONS}
            isClearable
            onChange={(o: StatusOption | undefined) => onChange({ status: o?.value })}
          />
        </FormField>
        <FormField id="had_retries" className="OperationsTopNavItem">
          <FormLabel>Retries:</FormLabel>
          <FormSelect
            placeholder="All operations"
            value={findOption(HAD_RETRIES_OPTIONS, value.had_retries)}
            options={HAD_RETRIES_OPTIONS}
            isClearable
            onChange={(o: HadRetriesOption | undefined) => onChange({ had_retries: o?.value })}
          />
        </FormField>
      </div>
      <div className="OperationsTopNav">
        <FormField id="stuck" className="OperationsTopNavItem">
          <FormLabel>Stuck:</FormLabel>
          <Toggle>
            <ToggleButton
              active={value.stuck !== 'true'}
              onClick={() => value.stuck === 'true' && onChange({ stuck: '' })}
            >
              All
            </ToggleButton>
            <ToggleButton
              active={value.stuck === 'true'}
              onClick={() => value.stuck !== 'true' && onChange({ stuck: 'true' })}
            >
              Stuck
            </ToggleButton>
          </Toggle>
        </FormField>
      </div>
    </>
  );
};
