import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';

import classNames from 'classnames';
import { BigCarouselProvider, useBigCarousel } from './context';
import styles from './BigCarousel.module.css';

export type BigCarouselProps = {
  children: React.ReactComponentElement<typeof BigCarouselItem>[];
  activeSlideId: string;
};

const BigCarouselInner = ({ children, activeSlideId }: BigCarouselProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [inited, setInited] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const activeSlide = document.getElementById(activeSlideId);
    if (!activeSlide) {
      return;
    }

    setOffset(
      (root.offsetWidth - activeSlide.offsetWidth) / 2 - activeSlide.offsetLeft,
    );
  }, [activeSlideId, viewportWidth]);

  useEffect(() => {
    const refreshViewportWidth = () => {
      const node = containerRef.current;
      if (!node) {
        return;
      }
      node.style.transition = 'none';
      setViewportWidth(window.innerWidth);
      // on resize move the carousel without animation
      setTimeout(() => {
        node.style.removeProperty('transition');
      }, 100);
    };

    window.addEventListener('resize', refreshViewportWidth);
    return () => {
      window.removeEventListener('resize', refreshViewportWidth);
    };
  }, []);

  useLayoutEffect(() => {
    if (!inited && offset !== 0) {
      // Make sure that first render is not animated
      setTimeout(() => {
        setInited(true);
      }, 100);
    }
  }, [inited, offset]);

  return (
    <div className={styles.root} ref={rootRef}>
      <div
        className={classNames(styles.slidesContainer, {
          [styles.slidesContainerInited]: inited,
        })}
        ref={containerRef}
        style={{ transform: offset ? `translateX(${offset}px)` : 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

export type BigCarouselItemProps = React.HTMLAttributes<HTMLDivElement> & {
  id: string;
};

const BigCarouselItem = ({
  children,
  className,
  ...rest
}: BigCarouselItemProps) => {
  const { addSlide, removeSlide } = useBigCarousel();
  const slideRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slideRef.current) {
      const { width } = slideRef.current.getBoundingClientRect();

      addSlide({
        id: rest.id,
        width,
      });
    }

    return () => {
      removeSlide(rest.id);
    };
  }, []);

  return (
    <div
      {...rest}
      className={classNames(styles.slide, className)}
      ref={slideRef}
    >
      {children}
    </div>
  );
};

export const BigCarousel = ({ children, ...rest }: BigCarouselProps) => (
  <BigCarouselProvider>
    <BigCarouselInner {...rest}>{children}</BigCarouselInner>
  </BigCarouselProvider>
);

BigCarousel.Item = BigCarouselItem;
