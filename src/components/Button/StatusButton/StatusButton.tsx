import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonProps } from '#shared/components/Button/Button';
import { IconName } from '#shared/components/SvgIcon/SvgIcon';
import { Loader } from '#shared/components/Loader/Loader';
import { ComponentWithAsProp } from '#shared/types/Props';

type StatusButtonLabel = readonly [
  string, // default
  string, // loading
  string, // succeed
];

enum StatusButtonState {
  Default,
  Loading,
  Succeed,
}

interface StatusButtonProps extends ButtonProps {
  succeed?: boolean;
  loading?: boolean;
  label: StatusButtonLabel;
}

export const STATUS_BUTTON_LABELS: Record<string, StatusButtonLabel> = {
  Save: ['Save', 'Saving', 'Saved'],
  Create: ['Create', 'Creating', 'Created'],
};

const STATUS_BUTTON_ICONS: Partial<Record<StatusButtonState, IconName | React.ReactNode>> = {
  [StatusButtonState.Loading]: <Loader />,
  [StatusButtonState.Succeed]: 'check-24',
};

const STATUS_BUTTON_RESET_TIMEOUT = 2000;

export const StatusButton: ComponentWithAsProp<'button', StatusButtonProps> = ({
  label, succeed = false, loading = false, ...props
}: StatusButtonProps) => {
  const [state, setState] = useState(StatusButtonState.Default);
  const setStateTimeout = useRef<number>();

  useEffect(() => {
    window.clearTimeout(setStateTimeout.current);

    if (succeed) {
      setState(StatusButtonState.Succeed);
    } else {
      setState(loading ? StatusButtonState.Loading : StatusButtonState.Default);
    }
  }, [succeed, loading]);

  useEffect(() => {
    if (state === StatusButtonState.Succeed) {
      window.clearTimeout(setStateTimeout.current);
      setStateTimeout.current = window.setTimeout(
        () => setState(StatusButtonState.Default),
        STATUS_BUTTON_RESET_TIMEOUT,
      );
    }
  }, [state]);

  useEffect(() => () => {
    window.clearTimeout(setStateTimeout.current);
  }, []);

  return (
    <Button
      {...props}
      icon={STATUS_BUTTON_ICONS[state]}
    >
      {label[state]}
    </Button>
  );
};
