import React from 'react';
import classNames from 'classnames';
import { Button, ButtonProps } from '#shared/components/Button/Button';

import { AnyLink } from '#shared/components/AnyLink/AnyLink';
import styles from './Widget.module.css';

interface WidgetLinkProps extends ButtonProps {}

export const WidgetLink = (props: WidgetLinkProps) => (
  <Button
    appearance="default"
    size="s"
    as={AnyLink}
    {...props}
    className={classNames(styles.link, props.className)}
  />
);
