import React, { forwardRef, useMemo } from 'react';

import {
  FormSelect,
  FormSelectProps,
  useUpdateValueOnOptionsChangeEffect,
} from '#shared/components/Form/FormSelect/FormSelect';
import { ProjectScopeProps } from '#shared/types/Props';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { BranchSelectOption, useBranches } from '#shared/hooks/projectBranches';
import { BranchPrimaryBadgeConditional } from '#shared/components/BranchPrimaryBadgeConditional/BranchPrimaryBadgeConditional';

import { OptionProps } from 'react-select';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { useProjectEndpoints } from '../../hooks/projectEndpoints';
import styles from './BranchSelect.module.css';

export const BranchValueComponent = (props: any) => (
  <div className={styles.branchValueComponent}>
    {props.selectProps.showIcon && (
    <SvgIcon
      name="branching_14"
      className={styles.branchValueIcon}
    />
    )}
    <span className={styles.branchValueLabel} title={props.children}>
      {props.children}
      <BranchPrimaryBadgeConditional branch={props.data.branch} />
    </span>
  </div>
);

const BranchOptionComponent = (
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

interface BranchSelectProps
  extends FormSelectProps<BranchSelectOption> {
  showIcon?: boolean;
}

export const BranchSelectStateless = forwardRef(({
  projectId,
  disableBranchesWithoutEndpoints,
  ...props
}: BranchSelectProps & ProjectScopeProps, ref) => {
  useUpdateValueOnOptionsChangeEffect(props);

  return (
    <FormSelect
      {...ref}
      {...props}
      placeholder={props.isLoading ? 'Loading...' : 'Select branch...'}
      components={{
        SingleValue: BranchValueComponent,
        Option: BranchOptionComponent,
      }}
      isOptionDisabled={(option: BranchSelectOption) => option.disabled}
    />
  );
});
BranchSelectStateless.displayName = 'BranchSelectStateless';

export const BranchSelect = forwardRef(({
  disableBranchesWithoutEndpoints,
  ...props
}: BranchSelectProps & { disableBranchesWithoutEndpoints?: boolean;
}, ref) => {
  const { projectId } = useProjectsItemContext();

  const {
    selectOptions, isLoading, fetch,
  } = useBranches();
  const {
    endpointsByBranchId,
    fetch: fetchEndpoints,
    isLoading: isEndpointsLoading,
  } = useProjectEndpoints();

  React.useEffect(() => {
    fetch();
    if (disableBranchesWithoutEndpoints) {
      fetchEndpoints();
    }
  }, [
    projectId,
    disableBranchesWithoutEndpoints,
  ]);

  const options = useMemo(() => {
    if (!disableBranchesWithoutEndpoints) {
      return selectOptions;
    }

    return selectOptions.map((o) => {
      const disabled = !endpointsByBranchId[o.branch.id]
        || !endpointsByBranchId[o.branch.id].length;
      return {
        ...o,
        disabled,
        tooltip: disabled ? 'A branch must have a compute endpoint in order to connect to it' : undefined,
      };
    });
  }, [disableBranchesWithoutEndpoints, selectOptions, endpointsByBranchId]);

  return (
    <BranchSelectStateless
      {...ref}
      {...props}
      projectId={projectId}
      options={options}
      isLoading={isLoading || isEndpointsLoading}
    />
  );
});
BranchSelect.displayName = 'BranchSelect';
