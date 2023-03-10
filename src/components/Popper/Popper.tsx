import React, {
  ForwardedRef, forwardRef, HTMLAttributes, PropsWithChildren,
} from 'react';

import classNames from 'classnames';
import ReactDOM from 'react-dom';
import useSSR from 'use-ssr';

import './Popper.css';

interface PopperProps extends HTMLAttributes<HTMLDivElement> {
  usePortal?: boolean;
  hidden?: boolean;
}

export const Popper = forwardRef((
  {
    usePortal,
    children,
    hidden,
    ...attrs
  }: PropsWithChildren<PopperProps>, ref: ForwardedRef<HTMLDivElement>,
) => {
  const { isServer } = useSSR();

  const popper = (
    <div
      {...attrs}
      ref={ref}
      className={classNames(attrs.className, 'Popper', {
        Popper_hidden: hidden,
      })}
    >
      {children}
    </div>
  );

  return usePortal && !isServer ? ReactDOM.createPortal(popper, document.body) : popper;
});

Popper.displayName = 'Popper';
Popper.defaultProps = {
  hidden: false,
  usePortal: false,
};
