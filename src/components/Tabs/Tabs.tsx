import React from 'react';
import { FormSelectProps } from '#shared/components/Form/FormSelect/FormSelect';

import classNames from 'classnames';
import styles from './Tabs.module.css';

interface TabsProps<T extends string | number = string>
  extends Pick<FormSelectProps<{
    label: string;
    value: T;
  }>, 'options'> {
  value: T;
  onChange(value: T): void;
  className?: string;
}

export function Tabs<T extends string | number = string>({
  value,
  options,
  onChange,
  className,
}: TabsProps<T>) {
  if (!options) {
    return null;
  }

  return (
    <ul className={classNames(styles.root, className)}>
      {options.map((option) => (
        <li
          key={option.value}
          className={classNames(styles.item, {
            [styles.item_active]: option.value === value,
          })}
        >
          <button
            type="button"
            className={styles.button}
            onClick={() => onChange && onChange(option.value)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
