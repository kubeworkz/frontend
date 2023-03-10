import React, { HTMLAttributes } from 'react';
import { Button, ButtonProps } from '#shared/components/Button/Button';
import { ComponentWithAsProp, ReplaceProps } from '#shared/types/Props';

// eslint-disable-next-line func-names
export const CreateButton: ComponentWithAsProp<'button', ButtonProps> = function<As extends React.ElementType>({
  children,
  disabled,
  ...props
}: ReplaceProps<As, ButtonProps<As>>) {
  return (
    disabled ? (
      <Button
        {...props as HTMLAttributes<HTMLButtonElement>}
        as="button"
        disabled
      >
        {children}
      </Button>
    ) : (
      <Button
        type="button"
        {...props as ButtonProps}
      >
        {children}
      </Button>
    )
  );
};
