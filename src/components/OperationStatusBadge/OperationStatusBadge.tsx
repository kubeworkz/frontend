import React from 'react';

import { OperationStatus } from '#api_client/generated/api';

import { StatusBadge, StatusBadgeAppearance } from '#shared/components/StatusBadge/StatusBadge';
import styles from './OperationStatusBadge.module.css';

interface OperationStatusBadgeProps {
  status: OperationStatus;
}

const OPERATION_STATUS_BADGE_LABEL: Record<OperationStatus, string> = {
  [OperationStatus.Scheduling]: 'Scheduling',
  [OperationStatus.Running]: 'In progress',
  [OperationStatus.Failed]: 'Error',
  [OperationStatus.Finished]: 'OK',
};

const OPERATION_STATUS_BADGE_APPEARANCE: Record<OperationStatus, StatusBadgeAppearance> = {
  [OperationStatus.Scheduling]: 'tertiary',
  [OperationStatus.Running]: 'highlight-secondary',
  [OperationStatus.Failed]: 'error',
  [OperationStatus.Finished]: 'success',
};

export const OperationStatusBadge = ({ status }: OperationStatusBadgeProps) => (
  <StatusBadge
    className={styles.root}
    label={OPERATION_STATUS_BADGE_LABEL[status]}
    appearance={OPERATION_STATUS_BADGE_APPEARANCE[status]}
  />
);
