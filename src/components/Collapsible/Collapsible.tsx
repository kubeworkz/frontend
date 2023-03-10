import React, {
  ReactNode, useCallback, useLayoutEffect, useRef, useState,
} from 'react';

import styles from './Collapsible.module.css';

export type CollapsibleProps = {
  collapsed: boolean;
  children: ReactNode;
};

export const Collapsible = ({ collapsed, children }: CollapsibleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initial, setInitial] = useState(true);
  const onTransitionEnd = useCallback((event: TransitionEvent) => {
    const node = event.currentTarget as HTMLDivElement;
    node.style.height = 'auto';
  }, []);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (collapsed && initial) {
      node.style.height = '0px';
      setInitial(false);
      return;
    }
    node.removeEventListener('transitionend', onTransitionEnd);
    if (collapsed) {
      const { height } = node.getBoundingClientRect();
      node.style.height = `${height}px`;
      setTimeout(() => {
        node.style.height = '0px';
      });
    } else {
      node.style.height = 'auto';
      const { height } = node.getBoundingClientRect();
      node.style.height = '0px';
      setTimeout(() => {
        node.style.height = `${height}px`;
        node.addEventListener('transitionend', onTransitionEnd);
      });
    }
  }, [collapsed, initial]);

  return (
    <div className={styles.root} ref={containerRef}>{children}</div>
  );
};
