import React from 'react';

import { Endpoint } from '#api_client/publicv2';
import { FormRadio } from '#shared/components/Form/FormRadio/FormRadio';

import { useBranches } from '#shared/hooks/projectBranches';
import styles from './EndpointsListItem.module.css';

export type EndpointsListItemProps = {
  endpoint: Endpoint;
  onClick: () => void;
  selected: boolean;
};

export const EndpointsListItem = ({
  endpoint,
  onClick,
  selected,
}: EndpointsListItemProps) => {
  const { branchesById } = useBranches();
  const branch = branchesById[endpoint.branch_id];
  return (
    <button type="button" className={styles.root} onClick={onClick}>
      <FormRadio id={`radio-${endpoint.id}`} className={styles.radio} checked={selected} readOnly />
      <div className={styles.main}>
        <div className={styles.name}>{endpoint.id}</div>
        <ul className={styles.features}>
          <li className={styles.feature_item}>{endpoint.region_id}</li>
          {branch && (
          <li className={styles.feature_item}>
            on
            {' '}
            <strong>
              {branch?.name || endpoint.branch_id}
              {' '}
              branch
            </strong>
          </li>
          )}
        </ul>
      </div>
    </button>
  );
};
