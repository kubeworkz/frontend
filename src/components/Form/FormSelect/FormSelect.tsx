import React, {
  forwardRef, SelectHTMLAttributes, useRef,
} from 'react';
import { GroupTypeBase, Props as SelectProps } from 'react-select';
import { ValueContainer } from 'react-select/animated';
import classNames from 'classnames';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { SizeProps } from '#shared/types/Props';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { useFormFieldContext } from '#shared/components/Form/FormField/formFieldContext';

import './FormSelect.css';

const Select = React.lazy(() => import('react-select'));

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<
  T extends {} = SelectOption> extends
  SizeProps,
  Pick<SelectHTMLAttributes<HTMLSelectElement>, 'className'>,
  SelectProps<T> {
  containerClassName?: string;
}

const FormSelectDropdown = ({ innerRef, innerProps }: any) => (
  <SvgIcon
    name="chevron-down_16"
    ref={innerRef}
    {...innerProps}
    className={classNames(innerProps.className, 'FormSelect__indicator', 'FormSelect__indicator_dropdown')}
  />
);

const FormSelectClear = ({ innerRef, innerProps }: any) => (
  <SvgIcon
    name="clear-24"
    ref={innerRef}
    {...innerProps}
    className={classNames(innerProps.className, 'FormSelect__indicator', 'FormSelect__indicator_clear')}
  />
);

const FormSelectValueContainer = (props: any) => {
  const title = props.selectProps.value && props.selectProps.value.map((o: any) => o.label).join(', ');
  return (
    <ValueContainer {...props}>
      <div title={title} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
      {props.children[1]}
    </ValueContainer>
  );
};

export const FormSelect = forwardRef((
  {
    className, containerClassName, size = 'm', components = {}, ...props
  }: FormSelectProps, ref,
) => {
  const { id, invalid } = useFormFieldContext();

  const selectRef = useRef<any>();

  const onFocus = () => {
    if (selectRef && selectRef.current) {
      selectRef.current.focus();
    }
  };

  return (
    <div className={classNames(containerClassName, 'FormSelectContainer')}>
      <input
        className="FormSelectAnchor"
        id={id}
        onFocus={onFocus}
        style={{
          opacity: 0, width: 0, height: 0, overflow: 'hidden',
        }}
        tabIndex={-1}
        aria-hidden
      />
      <React.Suspense fallback={(
        <FormInput
          id={`${id}_select_fallback`}
          disabled={props.disabled}
          className={containerClassName}
          readOnly
        />
      )}
      >
        <Select
          id={`${id}_select`}
          hideSelectedOptions={false}
          isSearchable={!props.isMulti}
          closeMenuOnSelect={!props.isMulti}
          {...props}
          menuPortalTarget={props.menuPortalTarget || document.body}
          isOptionDisabled={(option: SelectOption) => option.disabled}
          components={{
            DropdownIndicator: FormSelectDropdown,
            ClearIndicator: FormSelectClear,
            ...(props.isMulti ? {
              ValueContainer: FormSelectValueContainer,
            } : {}),
            ...components,
          }}
          ref={selectRef}
          innerRef={ref}
          classNamePrefix="FormSelect"
          className={classNames(className, 'FormSelect',
            `FormSelect_size-${size}`,
            {
              FormSelect_invalid: invalid,
              FormSelect_empty: !props.value,
            })}
          styles={{
            input: (provided: CSSStyleDeclaration) => ({
              ...provided,
              margin: 0,
              padding: 0,
            }),
          }}
        />
      </React.Suspense>
    </div>
  );
});
FormSelect.displayName = 'FormSelect';

export function getFirstAvailableOption<T extends SelectOption>(
  options: SelectProps<T>['options'],
): T | null {
  if (!options || !options.length) {
    return null;
  }

  let result = null;

  options.some((opt) => {
    if (Object.hasOwnProperty.call(opt, 'options')) {
      result = getFirstAvailableOption((opt as GroupTypeBase<T>).options);
      return !!result;
    }

    if (opt.disabled) {
      return false;
    }

    result = opt;
    return true;
  });

  return result;
}

// this function will update the value of the select when options
// array has been changed. For example if the options array no longer includes the value
// it will be reset.
// XXX: maybe we should handle it in the components itself instead of the select?
export function useUpdateValueOnOptionsChangeEffect<T extends SelectOption>(
  props: SelectProps<T>,
  areOptionsEqual: (o1: T, o2: T) => boolean = (o1, o2) => (o1.value === o2.value),
) {
  return React.useEffect(
    () => {
      if (!props.onChange) {
        return;
      }
      const optionsDoesntIncludeValue = props.value
        && (!props.options || !props.options.find(
          // @ts-ignore
          (opt) => (areOptionsEqual(opt, props.value)
          ),
        ));
      const shouldSetDefaultValue = !props.value
        && props.options && props.options.length
        && !props.isClearable && props.onChange;
      if (optionsDoesntIncludeValue || shouldSetDefaultValue) {
        const newOpt = getFirstAvailableOption(props.options);
        props.onChange(
          newOpt,
          // @ts-ignore
          { action: newOpt ? 'select-option' : 'clear', removedValue: props.value },
        );
      }
    }, [
      props.options,
      props.isLoading,
      props.isClearable,
      props.onChange,
      areOptionsEqual,
    ],
  );
}
