import React from 'react';
import { EndpointStatusBadge } from '../../components/EndpointStatusBadge/EndpointStatusBadge';
import { Loader } from '../../components/Loader/Loader';
import { useProjectEndpoints } from '../../app/hooks/projectEndpoints';

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
