import React, { useCallback } from 'react';
import { capitalize } from 'lodash';
import { FormInput } from '../Form/FormInput/FormInput';

import styles from './DataFilters.module.css';

export type OperatorByType<T> =
  T extends string ?
    '=' | '!=' | 'contains' :
    T extends number ?
      '=' | '!=' | '<' | '>' | '<=' | '>=':
      T extends boolean
        ? '=' | '!=' : never;

export type DataFiltersProps<T extends {}> = {
  filters: {
    [K in keyof T]: OperatorByType<T[K]>;
  }
  values: T;
  onChange: (v: T) => void;
};
export type FilterOperator = DataFiltersProps<any>['filters'][string];
const labels: Record<FilterOperator, string> = {
  contains: 'contains',
  '=': 'equals',
  '!=': 'not equals',
  '<': 'less',
  '<=': 'less or eq',
  '>': 'greater',
  '>=': 'greater or eq',
};

type FilterInputProps<T> = {
  operator: OperatorByType<T>;
  value: T;
  field: string;
  onChange: (v: T) => void;
};

function FilterInput<T extends string | number | boolean>(
  {
    operator, value, field, onChange,
  }: FilterInputProps<T>,
) {
  const onChangeCb = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange(value.constructor(event.target.value)),
    [],
  );
  return (
    <div className={styles.filterInput}>
      <span className={styles.filterInputLabel}>
        <span className={styles.filterInputField}>{capitalize(field)}</span>
        <br />
        {labels[operator]}
      </span>
      <FormInput onClear={() => onChange(value.constructor())} className={styles.filterInputControl} type="text" value={String(value)} onChange={onChangeCb} />
    </div>
  );
}

export function DataFilters <T extends {}>({ filters, values, onChange }: DataFiltersProps<T>) {
  const fields = Object.keys(filters) as (keyof T)[];

  return (
    <div className={styles.root}>
      {fields.map((field) => (
        <FilterInput
          key={field as string}
          field={String(field)}
          value={values[field] as any}
          operator={filters[field]}
          onChange={(v) => onChange({ ...values, [field]: v })}
        />
      ))}
    </div>
  );
}
