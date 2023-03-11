import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Text } from '../../components/Text/Text';
import { IconName, SvgIcon } from '../../components/SvgIcon/SvgIcon';

import './PageHeader.css';

interface LayoutContentHeaderProps
  extends HTMLAttributes<HTMLDivElement>{
  header: React.ReactNode;
  subheader?: React.ReactNode;
  subheaderIcon?: IconName;
  sticky?: boolean;
}

export const PageHeader = ({
  header, subheader, subheaderIcon, sticky, ...attrs
}: LayoutContentHeaderProps) => (
  <div
    {...attrs}
    className={classNames(attrs.className, 'LayoutContentHeader', {
      LayoutContentHeader_sticky: sticky,
    })}
  >
    <Text
      className="LayoutContentHeader__main"
      header
      size="s"
    >
      {header}
    </Text>
    {subheader
        && (
        <Text
          className="LayoutContentHeader__sub"
          appearance="secondary"
        >
          {subheaderIcon
            && (
            <div className="LayoutContentHeader__icon">
              <SvgIcon name={subheaderIcon} />
            </div>
            )}
          {subheader}
        </Text>
        )}
  </div>
);
