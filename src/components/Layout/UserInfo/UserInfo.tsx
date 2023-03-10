import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { UserPic } from '#shared/components/UserPic/UserPic';

import styles from './UserInfo.module.css';

interface UserInfoProps
  extends HTMLAttributes<HTMLDivElement> {
  name: string;
  image: string;
  isActive?: boolean;
  withHover?: boolean;
}

export const UserInfo = React.memo(({
  className, name, image, isActive, withHover, ...props
}: UserInfoProps) => (
  <div
    className={classNames(className, styles.root, {
      [styles.active]: isActive,
      [styles.withHover]: withHover,
    })}
    {...props}
  >
    <UserPic size="s" name={name} image={image} />
    <div
      className={styles.name}
      title={name}
    >
      {name}
    </div>
  </div>
));

UserInfo.displayName = 'UserInfo';
