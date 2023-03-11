import React, { forwardRef } from 'react';
import {
  FormSelect,
  FormSelectProps,
  useUpdateValueOnOptionsChangeEffect,
} from '../../components/Form/FormSelect/FormSelect';
import { ProjectScopeProps } from '../../types/Props';
import { BranchPrimaryBadgeConditional } from '../../components/BranchPrimaryBadgeConditional/BranchPrimaryBadgeConditional';
import { OptionProps } from 'react-select';
import { BranchSelectOption } from '../../hooks/projectBranches';
import { EndpointOption, useProjectEndpoints } from '../../app/hooks/projectEndpoints';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';

interface EndpointSelectProps
  extends FormSelectProps<EndpointOption> {
}

export const EndpointValueComponent = (props: any) => (
  <div>
    {props.children}
    <BranchPrimaryBadgeConditional branch={props.data.branch} />
  </div>
);

const EndpointOptionComponent = (
  props: OptionProps<BranchSelectOption, false, any>,
) => {
  const {
    children,
    className,
    cx,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
    data,
  } = props;

  return (
    <div
      className={cx(
        {
          option: true,
          'option--is-disabled': isDisabled,
          'option--is-focused': isFocused,
          'option--is-selected': isSelected,
        },
        className,
      )}
      ref={innerRef}
      aria-disabled={isDisabled}
      {...innerProps}
      title={data.tooltip}
    >
      {children}
      <BranchPrimaryBadgeConditional branch={data.branch} />
    </div>
  );
};

// xxx: this is a simple version of endpoints selector for now,
// because we have 1-1 mapping for branches and endpoints.
export const EndpointSelectStateless = forwardRef(({
  projectId,
  ...props
}: EndpointSelectProps & ProjectScopeProps, ref) => {
  useUpdateValueOnOptionsChangeEffect(props);

  return (
    <FormSelect
      {...ref}
      {...props}
      placeholder={props.isLoading ? 'Loading...' : 'Select branch...'}
      components={{
        SingleValue: EndpointValueComponent,
        Option: EndpointOptionComponent,
      }}
    />
  );
});
EndpointSelectStateless.displayName = 'EndpointSelectStateless';

export const EndpointSelect = forwardRef((props: EndpointSelectProps, ref) => {
  const { projectId } = useProjectsItemContext();

  const {
    selectOptions, isLoading,
  } = useProjectEndpoints();

  return (
    <EndpointSelectStateless
      {...ref}
      {...props}
      options={selectOptions}
      isLoading={isLoading}
      projectId={projectId}
    />
  );
});
EndpointSelect.displayName = 'EndpointSelect';
