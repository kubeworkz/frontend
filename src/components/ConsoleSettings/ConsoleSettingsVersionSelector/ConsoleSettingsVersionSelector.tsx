import React from 'react';
import { FormSelect } from '#shared/components/Form/FormSelect/FormSelect';
import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';

interface ConsoleSettingsVersionSelectorProps {
  currentVersion: any;
  onChange(v: any): void;
  options: any[];
}

export const ConsoleSettingsVersionSelector = ({
  currentVersion,
  onChange,
  options,
}: ConsoleSettingsVersionSelectorProps) => {
  const selectedOption = React.useMemo(() => {
    if (typeof currentVersion === 'number' && options.length) {
      return options.find((o) => o.value === currentVersion);
    }

    return undefined;
  }, [options, currentVersion]);

  return (
    <>
      <FormLabel>Select a version</FormLabel>
      <FormSelect
        size="s"
        options={options}
        value={selectedOption}
        onChange={(o: any) => onChange(o.value)}
      />
    </>
  );
};
