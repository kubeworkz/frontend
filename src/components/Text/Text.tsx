import React, { AllHTMLAttributes, PropsWithChildren } from 'react';
import {
  Appearance,
  AppearanceProps, AppearanceStatus, AsProps, ReplaceProps, SizeProps,
} from '#shared/types/Props';
import classNames from 'classnames';

import './Text.css';

export interface TextProps extends
  AppearanceProps<Appearance | AppearanceStatus>,
  AsProps,
  SizeProps,
  Omit<AllHTMLAttributes<HTMLElement>, 'as' | 'size'> {
  bold?: boolean;
  header?: boolean;
  align?: 'center' | 'left' | 'right' | string;
  nowrap?: boolean
}

export function Text<As extends React.ElementType>(
  {
    appearance,
    size,
    as: Component = 'div',
    align,
    nowrap = false,
    bold,
    header,
    children,
    ...props
  }: ReplaceProps<As, PropsWithChildren<TextProps>>,
) {
  return (
    <Component
      {...props}
      className={classNames(
        props.className,
        'Text',
        appearance ? `Text_${appearance}` : '',
        size ? `Text_${size}` : '',
        {
          Text_header: header,
          Text_bold: bold,
          Text_nowrap: nowrap,
          [`Text_align-${align}`]: !!align,
        },
      )}
    >
      {children}
    </Component>
  );
}
