import React from 'react';
import { EndpointState } from '#api_client/generated/api';
import { conformEndpointState } from '#api_client/utils';
import classNames from 'classnames';
import { Badge } from '#shared/components/Badge/Badge';
import { AppearanceStatus } from '#shared/types/Props';
import { Loader } from '#shared/components/Loader/Loader';
import {
  EndpointStatusBadgeProps,
} from './utils';

import './AdminProjectStatusBadge.css';

const getProjectStatusBadgeAppearance: (s: EndpointState) => AppearanceStatus = (state) => {
  const strictState = conformEndpointState(state);
  switch (strictState) {
    case 'idle':
      return 'default';
    case 'stopped':
    case 'init':
      return 'warning';
    default:
      return 'success';
  }
};

export const AdminEndpointStatusBadge = ({
  endpoint,
  className,
  ...props
}: EndpointStatusBadgeProps) => {
  if (endpoint.deleted) {
    return (
      <Badge
        {...props}
        appearance="error"
      >
        Deleted
      </Badge>
    );
  }

  return (
    endpoint.pending_state ? (
      <div
        className={classNames(className, 'AdminProjectStatusBadge')}
        {...props}
      >
        <Loader />
        <span className="AdminProjectStatusBadge_label">
          {endpoint.current_state}
          {' => '}
          {endpoint.pending_state}
        </span>
      </div>
    )
      : (
        <Badge
          appearance={getProjectStatusBadgeAppearance(endpoint.current_state)}
          className={className}
          {...props}
        >
          {endpoint.current_state}
        </Badge>
      )
  );
};
