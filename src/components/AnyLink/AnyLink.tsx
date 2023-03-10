import React, {
  AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, useCallback,
} from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import cx from 'classnames';
import { AnalyticsAction, useAnalyticsSafe } from '#shared/utils/analytics';

export interface AnyLinkBasicConfig {
  id?: string;
  as?: 'a' | 'button' | 'div',
  active?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  trackClick?: AnalyticsAction;
}

interface AnyLinkAnchorConfig extends
  AnyLinkBasicConfig,
  AnchorHTMLAttributes<HTMLAnchorElement> {
  as: 'a',
}

export interface AnyLinkButtonConfig extends
  AnyLinkBasicConfig,
  ButtonHTMLAttributes<HTMLButtonElement> {
  as: 'button',
}

type NavLinkPropsClean = Omit<NavLinkProps, 'className'> & {
  className?: string;
};

interface AnyLinkNavLinkConfig extends
  AnyLinkBasicConfig,
  NavLinkPropsClean {}

interface AnyLinkDivConfig extends
  AnyLinkBasicConfig,
  HTMLAttributes<HTMLDivElement> {
  as: 'div',
}

export type AnyLinkConfig =
  AnyLinkAnchorConfig
  | AnyLinkButtonConfig
  | AnyLinkNavLinkConfig
  | AnyLinkDivConfig;

interface AnyLinkProps {
  activeClassName?: string;
  disabledClassName?: string;
  className?: string;
}

export const AnyLink = ({
  className,
  disabledClassName,
  activeClassName,
  as,
  active,
  disabled,
  children,
  trackClick,
  ...props
}: AnyLinkConfig & AnyLinkProps) => {
  const navClassNames = cx(
    className,
    {
      [`${disabledClassName}`]: disabled,
      [`${activeClassName}`]: active,
    },
  );

  const { trackUiInteraction } = useAnalyticsSafe();

  const onClick = useCallback((event: any) => {
    if (trackClick) {
      trackUiInteraction(trackClick);
    }
    if (props.onClick) {
      props.onClick(event);
    }
  }, [trackClick, props.onClick]);

  if (disabled) {
    return <span className={navClassNames}>{children}</span>;
  }

  if (as) {
    const Component = as;
    return (
      // @ts-ignore
      <Component
        {...props}
        onClick={onClick}
        className={navClassNames}
      >
        {children}
      </Component>
    );
  }

  return (
    <NavLink
      {...props as NavLinkProps}
      activeClassName={activeClassName}
      className={navClassNames}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};
