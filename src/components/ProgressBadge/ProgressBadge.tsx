/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import React, { useLayoutEffect } from 'react';

import styles from './ProgressBadge.module.css';

type ProgressBadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
};

export const ProgressBadge = ({
  active, children, className, ...rest
}: ProgressBadgeProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState<number | null>(null);
  const [height, setHeight] = React.useState<number | null>(null);
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
    setWidth(node.offsetWidth);
    setHeight(node.offsetHeight);
  }, []);

  const calculatedWidth = width === null ? 'auto' : active ? width : 0;
  const calculatedHeight = height === null ? 'auto' : active ? height : 0;

  return (
    <div
      {...rest}
      className={classNames(styles.root, className, {
        [styles.active]: active,
      })}
    >
      <div
        ref={contentRef}
        className={styles.content}
        style={{
          width: calculatedWidth,
          height: calculatedHeight,
        }}
      >
        {children}
      </div>
    </div>
  );
};
