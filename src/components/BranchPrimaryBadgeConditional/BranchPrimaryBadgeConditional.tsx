import React from 'react';
import { Branch } from '../../api/generated/api_public_v2';
import { Badge } from '../../components/Badge/Badge';

interface BranchPrimaryBadgeProps {
  branch?: Branch
}

export const BranchPrimaryBadgeConditional = ({ branch }: BranchPrimaryBadgeProps) => {
  if (!branch || !branch.primary) {
    return null;
  }

  return <Badge appearance="default">primary</Badge>;
};
