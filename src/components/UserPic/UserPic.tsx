import React from 'react';

import classNames from 'classnames';
import styles from './UserPic.module.css';

export type UserPicProps = {
  size?: 's' | 'm';
  name?: string;
  image?: string;
};
export const UserPic = React.memo(({ size = 'm', name = '', image }: UserPicProps) => (
  <span
    className={classNames(styles.image, styles[`image_${size}`])}
    style={image ? { backgroundImage: `url(${image})` } : {}}
  >
    {!image && (
      <div className={styles.imagePlaceholder}>
        {name[0]?.toUpperCase()}
      </div>
    )}
  </span>
));

UserPic.displayName = 'UserPic';
