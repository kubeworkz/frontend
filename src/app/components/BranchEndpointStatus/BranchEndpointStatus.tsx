import React from 'react';
import { EndpointStatusBadge } from '#shared/components/EndpointStatusBadge/EndpointStatusBadge';
import { Loader } from '#shared/components/Loader/Loader';
import { useProjectEndpoints } from '../../hooks/projectEndpoints';

interface BranchEndpointStatusProps {
  branchId: string;
}

export const BranchEndpointStatus = ({ branchId }: BranchEndpointStatusProps) => {
  const { endpointsByBranchId, isLoading: isEndpointsLoading } = useProjectEndpoints();

  if (isEndpointsLoading) {
    return <Loader />;
  }

  if (endpointsByBranchId[branchId] && endpointsByBranchId[branchId].length) {
    return <EndpointStatusBadge endpoint={endpointsByBranchId[branchId][0]} />;
  }

  return <>-</>;
};
