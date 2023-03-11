/* eslint-disable react/no-array-index-key */
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { ActionsDropdown } from '../../../components/ActionsDropdown/ActionsDropdown';
import { ActionsDropdownItem } from '../../../components/ActionsDropdown/ActionDropdownItem/ActionsDropdownItem';
import { Divider } from '../../../components/Divider/Divider';
import { useCurrentUser } from '../../../hooks/currentUser';
import { AnyLinkConfig } from '../../../components/AnyLink/AnyLink';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';

import { UserInfo } from '../../../components/Layout/UserInfo/UserInfo';
import styles from './User.module.css';

export interface ConsoleLayoutUserProps extends HTMLAttributes<HTMLDivElement> {
  userMenuConfig?: (AnyLinkConfig | React.ReactNode)[];
  disableSignOut?: boolean;
}
export const User = ({ userMenuConfig, disableSignOut, className }: ConsoleLayoutUserProps) => {
  const { user: { name, image }, logout } = useCurrentUser();
  const { trackUiInteraction } = useAnalytics();

  const onClickSignOut = () => {
    trackUiInteraction(AnalyticsAction.UserMenuSignOutClicked);
    logout();
  };

  return (
    <div className={classNames(styles.root, className)}>
      <ActionsDropdown
        onOpenEventId={AnalyticsAction.UserMenuOpened}
        triggerElement={({ isActive, ...props }) => (
          <button
            type="button"
            {...props}
            className={styles.trigger}
          >
            <UserInfo
              isActive={isActive}
              withHover={!!userMenuConfig?.length || !disableSignOut}
              image={image}
              name={name}
            />
          </button>
        )}
        disabled={!userMenuConfig && disableSignOut}
        placement="right-end"
      >
        {userMenuConfig?.map((item, idx) => {
          if (React.isValidElement(item)) {
            return item;
          }
          return <ActionsDropdownItem key={idx} {...item as AnyLinkConfig} />;
        })}
        {!disableSignOut && (
          <>
            {userMenuConfig && !!userMenuConfig.length && <Divider />}
            <ActionsDropdownItem
              as="button"
              onClick={onClickSignOut}
            >
              Sign Out
            </ActionsDropdownItem>
          </>
        )}
      </ActionsDropdown>
    </div>
  );
};
