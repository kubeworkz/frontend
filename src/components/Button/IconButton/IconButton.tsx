import React, { ButtonHTMLAttributes } from 'react';
import { Appearance, AppearanceProps, AppearanceStatus } from '../../../types/Props';
import { IconName, SvgIcon } from '../../../components/SvgIcon/SvgIcon';
import classNames from 'classnames';

import styles from './IconButton.module.css';

export interface IconButtonProps extends
  ButtonHTMLAttributes<HTMLButtonElement>,
  AppearanceProps<Appearance | AppearanceStatus> {
  iconName: IconName;
}

export const IconButton = React.memo(({
  iconName, appearance = 'primary', className, ...props
}: IconButtonProps) => (
  <button
    type="button"
    {...props}
    className={classNames(className, styles[appearance], styles.root)}
  >
    <SvgIcon name={iconName} />
  </button>
));

IconButton.displayName = 'IconButton';
