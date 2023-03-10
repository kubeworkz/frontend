import React from 'react';
import { Branch } from '#api_client/generated/api_public_v2';
import { Badge } from '#shared/components/Badge/Badge';

interface BranchPrimaryBadgeProps {
  branch?: Branch
}

export const BranchPrimaryBadgeConditional = ({ branch }: BranchPrimaryBadgeProps) => {
  if (!branch || !branch.primary) {
    return null;
  }

  return <Badge appearance="default">primary</Badge>;
};
