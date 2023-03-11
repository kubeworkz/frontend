import React from 'react';
import { StatusBadge, StatusBadgeAppearance } from '../../components/StatusBadge/StatusBadge';
import { Endpoint, EndpointState } from '../../api/publicv2';

interface EndpointStatusBadgeProps {
  endpoint: Pick<Endpoint, 'current_state' | 'pending_state'>;
  short?: boolean;
}

export const STATE_DESCRIPTION: Record<string, string> = {
  [`${EndpointState.Init}_${EndpointState.Init}`]: 'Initializing',
  [`${EndpointState.Init}_${EndpointState.Active}`]: 'Starting compute',

  [`${EndpointState.Active}_${EndpointState.Idle}`]: '',
  [`${EndpointState.Active}_${EndpointState.Active}`]: 'Configuring',

  [`${EndpointState.Idle}_${EndpointState.Active}`]: 'Starting compute',

  [EndpointState.Idle]: 'Compute is suspended and automatically activates on client connections',
  [EndpointState.Active]: 'Compute is active and accepts connections',
};

const STATE_APPEARANCE: Record<EndpointState, StatusBadgeAppearance> = {
  [EndpointState.Idle]: 'warning',
  [EndpointState.Active]: 'success',
  [EndpointState.Init]: 'secondary',
};

const getEndpointStatusBadgeLabel: (
  s: EndpointState,
  p?: EndpointState,
) => string = (state, pending) => {
  if (pending) {
    return 'Pending';
  }
  switch (state) {
    case EndpointState.Idle:
      return 'Idle';
    case EndpointState.Init:
      return 'Init';
    case EndpointState.Active:
      return 'Active';
    default:
      return '';
  }
};

export const EndpointStatusBadge = ({ endpoint, ...props }: EndpointStatusBadgeProps) => (
  <StatusBadge
    {...props}
    pending={!!endpoint.pending_state}
    label={getEndpointStatusBadgeLabel(endpoint.current_state, endpoint.pending_state)}
    tooltip={endpoint.pending_state ? STATE_DESCRIPTION[`${endpoint.current_state}_${endpoint.pending_state}`] : STATE_DESCRIPTION[endpoint.current_state]}
    appearance={STATE_APPEARANCE[endpoint.current_state]}
  />
);
