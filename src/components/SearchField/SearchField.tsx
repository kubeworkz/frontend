import React, { useRef, useState } from 'react';
import { FormInput, FormInputProps } from '#shared/components/Form/FormInput/FormInput';
import { debounce } from 'throttle-debounce';

interface SearchFieldProps extends Omit<FormInputProps, 'onChange'> {
  onChange(s: string): void;
  timeout?: number; // ms
  minLength?: number;
}

export const SearchField = ({
  onChange, timeout = 500, minLength = 3, ...props
}: SearchFieldProps) => {
  const [value, setValue] = useState('');

  const debouncedOnChangeRef = useRef<debounce<(v: string) => void>>();

  const onInputChange = React.useCallback((e) => {
    setValue(e.target.value);
  }, []);

  React.useEffect(() => {
    debouncedOnChangeRef.current?.cancel();

    debouncedOnChangeRef.current = debounce(timeout, (v: string) => {
      onChange(v);
    });
  }, [timeout, onChange]);

  const trimmed = React.useMemo(() => value.trim().toLowerCase(), [value]);

  React.useLayoutEffect(() => {
    // todo: Will this trigger onChange right after mount?
    if (debouncedOnChangeRef.current) {
      debouncedOnChangeRef.current(trimmed.length < minLength ? '' : trimmed);
    }
  }, [trimmed]);

  return (
    <FormInput
      placeholder="Search..."
      {...props}
      value={value}
      onChange={onInputChange}
    />
  );
};
