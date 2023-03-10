import React, { AriaAttributes, PropsWithChildren, useState } from 'react';
import * as PopperJS from '@popperjs/core';
import { usePopper } from 'react-popper';
import classNames from 'classnames';

import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { Popper } from '#shared/components/Popper/Popper';

import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import styles from './ActionsDropdown.module.css';

interface ActionsDropdownProps extends AriaAttributes {
  onOpenEventId?: AnalyticsAction;
  triggerElement?: (props: {
    onClick: (e: React.MouseEvent) => void;
    ref: React.Ref<HTMLButtonElement>;
    isActive: boolean;
  }) => React.ReactNode;
  disabled?: boolean;
  placement?: PopperJS.Placement;
}

const ActionsDropdownDefaultTrigger: ActionsDropdownProps['triggerElement'] = ({
  onClick, ref, isActive, ...props
}) => (
  <button
    type="button"
    className={classNames(styles.button, isActive && styles.button_active)}
    ref={ref}
    onClick={onClick}
    {...props}
  >
    <SvgIcon name="actions_16" />
  </button>
);

export const ActionsDropdown = ({
  children,
  triggerElement = ActionsDropdownDefaultTrigger,
  onOpenEventId,
  placement = 'bottom-end',
  ...props
}: PropsWithChildren<ActionsDropdownProps>) => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { trackUiInteraction } = useAnalytics();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { styles: popperStyles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement,
      modifiers: [
        {
          name: 'eventListeners',
          options: {
            scroll: dropdownVisible,
            resize: dropdownVisible,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 16],
          },
        },
      ],
    },
  );

  const hideDropdown = () => {
    setDropdownVisible(false);
  };

  const onButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (dropdownVisible) {
      hideDropdown();
    } else {
      if (update) {
        update();
      }
      setDropdownVisible(true);
      if (onOpenEventId) {
        trackUiInteraction(onOpenEventId);
      }
    }
  }, [dropdownVisible, update, onOpenEventId]);

  React.useEffect(() => {
    window.addEventListener('click', hideDropdown);
    return () => {
      window.removeEventListener('click', hideDropdown);
    };
  }, []);

  const trigger = React.useMemo(() => triggerElement({
    onClick: onButtonClick,
    ref: setReferenceElement,
    isActive: dropdownVisible,
    ...props,
  }), [triggerElement, onButtonClick, setReferenceElement, dropdownVisible]);

  return (
    <div>
      {trigger}
      <Popper
        usePortal
        className={styles.popper}
        hidden={!dropdownVisible}
        ref={setPopperElement}
        style={popperStyles.popper}
        {...attributes.popper}
        onClick={(e) => {
          e.stopPropagation();
          hideDropdown();
        }}
      >
        {children}
      </Popper>
    </div>
  );
};
