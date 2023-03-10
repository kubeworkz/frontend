import React from 'react';
import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { FilterComponentProps } from '../DataPage/DataPage';

import styles from './UsersList.module.css';

interface UsersListFiltersProps extends FilterComponentProps<{
  search?: string;
}> {}

export const UsersListFilters = ({ value, onChange, disabled }: UsersListFiltersProps) => {
  const onChangeSearch = React.useCallback((e) => {
    onChange({ search: e.target.value });
  }, [onChange]);

  return (
    <div className={styles.filters}>
      <FormField
        id="search_field"
        className={styles.field_search}
      >
        <FormLabel>User name, email or invite:</FormLabel>
        <FormInput
          disabled={disabled}
          placeholder="Search"
          value={value.search}
          onChange={onChangeSearch}
        />
      </FormField>
    </div>
  );
};
