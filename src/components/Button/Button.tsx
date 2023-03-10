import React from 'react';
import classNames from 'classnames';

import { IconName, SvgIcon } from '../SvgIcon/SvgIcon';
import {
  Appearance,
  AppearanceProps,
  AppearanceSocial,
  AppearanceStatus,
  AsProps,
  ComponentWithAsProp,
  ReplaceProps,
  SizeProps,
} from '../../types/Props';

import styles from './Button.module.css';

export interface ButtonProps<As extends React.ElementType = React.ElementType> extends
  AsProps<As>,
  SizeProps,
  AppearanceProps<Appearance | AppearanceStatus | AppearanceSocial> {
  wide?: boolean;
  narrow?: boolean;
  icon?: IconName | React.ReactNode;
  iconSize?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  'data-qa'?: string;
}

function ButtonComponent<As extends React.ElementType>(
  {
    as,
    appearance = 'primary',
    wide = false,
    size = 'm',
    icon,
    iconSize,
    children,
    narrow,
    ...buttonAttrs
  }: ReplaceProps<As, ButtonProps<As>>,
  ref: React.Ref<unknown>,
) {
  const Component = (as || 'button') as React.ElementType;

  return (
    <Component
      {...buttonAttrs}
      ref={ref}
      className={classNames(
        buttonAttrs.className,
        styles.button,
        styles[`button_${appearance}`],
        styles[`button_size-${size}`],
        wide && styles.button_wide,
        narrow && styles.button_narrow,
        buttonAttrs.disabled && styles.button_disabled,
        !!icon && styles.button_hasIcon,
      )}
    >
      {icon
      && (
        <div className={styles.icon}>
          {typeof icon === 'string'
            ? <SvgIcon name={icon as IconName} size={iconSize} />
            : icon}
        </div>
      )}
      {children
      && (
        <span className={styles.body}>
          {children}
        </span>
      )}
    </Component>
  );
}

export const Button: ComponentWithAsProp<'button', ButtonProps> = React.forwardRef(ButtonComponent);
