import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import { AsProps, ReplaceProps } from '../../types/Props';

import './Skeleton.css';

interface SkeletonProps extends AsProps, HTMLAttributes<HTMLElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton<As extends React.ElementType>(
  {
    as: Component = 'div',
    children,
    width,
    height,
    style,
    ...props
  }: ReplaceProps<As, PropsWithChildren<SkeletonProps>>,
) {
  return (
    <Component
      {...props}
      className={classNames(props.className, 'Skeleton')}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
