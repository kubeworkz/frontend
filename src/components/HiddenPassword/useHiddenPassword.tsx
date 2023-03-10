import React, { useRef, useState } from 'react';

const HIDE_TIMEOUT = 5000;

export interface HiddenPasswordState {
  visible: boolean;
  reveal(): void;
  hide(): void;
}

export const useHiddenPassword: () => HiddenPasswordState = () => {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<number>();

  React.useEffect(() => {
    if (visible) {
      clearInterval(timeout.current);
      timeout.current = window.setTimeout(() => setVisible(false), HIDE_TIMEOUT);
    }
  }, [visible]);

  React.useEffect(() => () => {
    clearInterval(timeout.current);
  }, []);

  const reveal = React.useCallback(() => {
    setVisible(true);
  }, []);

  const hide = React.useCallback(() => {
    clearInterval(timeout.current);
    setVisible(false);
  }, []);

  return {
    visible,
    reveal,
    hide,
  };
};
