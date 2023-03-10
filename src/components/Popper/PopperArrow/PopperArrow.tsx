import React, { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';

import './PopperArrow.css';

export const PopperArrow = forwardRef((
  props: HTMLAttributes<HTMLDivElement>,
  ref: ForwardedRef<HTMLDivElement>,
) => (
  <div
    {...props}
    ref={ref}
    className={classNames(props.className, 'PopperArrow')}
  />
));

PopperArrow.displayName = 'PopperArrow';
