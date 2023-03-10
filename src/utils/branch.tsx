import React from 'react';
import { Branch, Project } from '#api_client/publicv2';
import { mbAsGB, bytesAsGB } from '#shared/utils/sizeHelpers';
import { humanReadableBytes } from '#shared/utils/units';

export const renderDataSize = (b: Pick<Branch, 'logical_size'>, p?: Pick<Project, 'branch_logical_size_limit'>) => (b.logical_size ? (
  <>
    {humanReadableBytes(b.logical_size)}
    &nbsp;
    {p && !!p.branch_logical_size_limit && (
      <>
        /
        {' '}
        {mbAsGB(p.branch_logical_size_limit)}
        &nbsp;
        GB
      </>
    )}
  </>
) : undefined);

export const renderStorageSize = (b: Pick<Branch, 'physical_size'>) => (b.physical_size ? (
  <>
    {bytesAsGB(b.physical_size)}
    {' '}
    GB
  </>
) : undefined);
