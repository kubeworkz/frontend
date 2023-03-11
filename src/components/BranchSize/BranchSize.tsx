import React from 'react';
import { Branch, Project } from '../../api/publicv2';
import { PercentBar } from '../../components/PercentBar/PercentBar';
import { humanReadableBytes } from '../../utils/units';
import { mbAsGB } from '../../utils/sizeHelpers';

interface BranchUsedSizeProps {
  branch: Branch;
  project?: Project;
}

export const BranchUsedSize = ({ branch, project }: BranchUsedSizeProps) => {
  if (!project || !branch.logical_size) {
    return null;
  }

  return (
    <PercentBar
      percent={branch.logical_size / (project.branch_logical_size_limit * 1000000)}
      hint={`${humanReadableBytes(branch.logical_size)} used of ${mbAsGB(project.branch_logical_size_limit)} GB`}
    />
  );
};
