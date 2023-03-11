import React from 'react';
import { FormField } from '../../components/Form/FormField/FormField';
import { FormLabel } from '../../components/Form/FormLabel/FormLabel';
import { Toggle } from '../../components/Toggle/Toggle';
import { ToggleButton } from '../../components/Toggle/ToggleButton/ToggleButton';
import { Text } from '../../components/Text/Text';
import { FormCheckbox } from '../../components/Form/FormCheckbox/FormCheckbox';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { FilterComponentProps } from '../DataPage/DataPage';

import './ProjectsList.css';

interface ProjectListFiltersProps extends FilterComponentProps<{
  user_id?: string;
  pageserver_id?: string;
  show_deleted?: string;
  stuck?: string;
  search?: string;
}> {}

export const ProjectListFilters = ({ value, onChange, disabled }: ProjectListFiltersProps) => {
  const onChangeName = React.useCallback((e) => {
    onChange({ search: e.target.value });
  }, [onChange]);

  return (
    <div className="ProjectsTopNav">
      <FormField id="search_field" className="ProjectsTopNavItem">
        <FormLabel>Project id or name, tenant:</FormLabel>
        <FormInput
          disabled={disabled}
          placeholder="Search"
          value={value.search}
          onChange={onChangeName}
        />
      </FormField>
      <FormField id="stuck" className="ProjectsTopNavItem ProjectsTopNavItem">
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
      <FormField id="deleted" className="ProjectsTopNavItem">
        <div className="ProjectsTopNavDeleted">
          <Text
            as="label"
            className="ProjectsTopNavDeleted__label"
            htmlFor="show_deleted"
            appearance="primary"
          >
            Show deleted
          </Text>
          <FormCheckbox
            className="ProjectsTopNavDeleted__circle"
            id="show_deleted"
            disabled={disabled}
            checked={value.show_deleted === 'true'}
            onChange={(event) => onChange({ show_deleted: event.target.checked ? 'true' : '' })}
          />
        </div>
      </FormField>
    </div>
  );
};
