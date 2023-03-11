import React, {
  useRef, useState,
} from 'react';
import { usePopper } from 'react-popper';
import { PopperArrow } from '../../components/Popper/PopperArrow/PopperArrow';
import { Popper } from '../../components/Popper/Popper';

import './WithTooltip.css';

interface WithTooltipProps {
  tooltipInner: React.ReactNode;
  children(opts: {
    ref(el: HTMLDivElement): void;
    onMouseOver(): void;
    onFocus(): void;
    onBlur(): void;
    onMouseLeave(): void;
  }): React.ReactNode;
  delay?: number;
}

// XXX: in case of slow rendering consider using tippy.js instead of popper
// https://github.com/floating-ui/react-popper/issues/419
export const WithTooltip = ({ tooltipInner, children, delay = 0 }: WithTooltipProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const [hintVisible, setHintVisible] = useState(false);

  const toggleTimerId = useRef<number | undefined>();

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'bottom',
      modifiers: [
        {
          name: 'eventListeners',
          options: {
            scroll: hintVisible,
            resize: hintVisible,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
        {
          name: 'arrow',
          options: { element: arrowElement },
        },
      ],
    },
  );

  const showHint = () => {
    if (!hintVisible) {
      toggleTimerId.current = window.setTimeout(() => {
        setHintVisible(true);
      }, delay);
      if (update) {
        update();
      }
    }
  };

  const hideHint = () => {
    clearInterval(toggleTimerId.current);
    setHintVisible(false);
  };

  return (
    <>
      {children({
        ref: setReferenceElement,
        onMouseOver: showHint,
        onFocus: showHint,
        onBlur: hideHint,
        onMouseLeave: hideHint,
      })}
      {hintVisible && tooltipInner && (
      <Popper
        hidden={!hintVisible}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="WithTooltipPopper"
        onClick={(e) => e.stopPropagation()}
        usePortal
      >
        {tooltipInner}
        <PopperArrow
          ref={setArrowElement}
          style={styles.arrow}
        />
      </Popper>
      )}
    </>
  );
};
