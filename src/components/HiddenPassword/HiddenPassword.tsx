import React from 'react';
import classNames from 'classnames';

import styles from './HiddenPassword.module.css';
import { HiddenPasswordState, useHiddenPassword } from './useHiddenPassword';

interface HiddenPasswordProps {
  value?: string;
  loading?: boolean;
}

export const HiddenPasswordStateless = ({
  value,
  visible,
  reveal,
  loading,
}: HiddenPasswordProps & Omit<HiddenPasswordState, 'hide'>) => (
  <div className={styles.root}>
    {(!visible || loading) ? 'xxxxxxxxxx' : value}
    <button
      type="button"
      className={classNames(
        styles.spoiler,
        (!visible || loading) && styles.spoilerVisible,
        loading && styles.loading,
      )}
      onClick={reveal}
      title="Click to reveal the spoiler"
    />
  </div>
);

export const HiddenPassword = ({
  value,
}: HiddenPasswordProps) => {
  const hook = useHiddenPassword();

  React.useEffect(() => {
    hook.hide();
  }, [value]);

  return (
    <HiddenPasswordStateless
      value={value}
      {...hook}
    />
  );
};
