import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { apiService, Endpoint, Project } from '#api_client/publicv2';
import { apiErrorToaster } from '#api_client/utils';
import { useResource } from '#shared/utils/useResource';
import { Button } from '#shared/components/Button/Button';

import { times } from 'lodash';
import { Alert } from '#shared/components/Alert/Alert';
import { PsqlConnectRoutes } from '../../config/routes';
import { EndpointsListItem } from '../EndpointsListItem/EndpointsListItem';
import { EndpointsListItemPlaceholder } from '../EndpointsListItem/EndpointsListItemPlaceholder';
import styles from './EndpointsList.module.css';

export type EndpointsListProps = {
  project?: Project;
  onSubmit: (endpoint: Endpoint, project: Project) => void;
};
export const EndpointsList = ({ project, onSubmit }: EndpointsListProps) => {
  const history = useHistory();
  const onBack = useCallback(() => {
    history.push(PsqlConnectRoutes.List);
  }, []);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>();

  const [endpoints, setEndpoints] = useResource<Endpoint[]>();

  useEffect(() => {
    if (!project) {
      return;
    }
    setEndpoints({ isLoading: true });
    apiService
      .listProjectEndpoints(project.id)
      .then(({ data }) => {
        if (data.endpoints.length === 1) {
          onSubmit(data.endpoints[0], project);
          return;
        }
        setEndpoints({ data: data.endpoints, isLoading: false });
        setSelectedEndpoint(data.endpoints[0]);
      })
      .catch(apiErrorToaster);
  }, [project?.id, onSubmit]);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <h2 className={styles.header}>Select the compute endpoint</h2>
        <div className={styles.subheader}>
          To connect to the project, you must select a compute endpoint
        </div>
        <ul className={styles.list}>
          {endpoints.isLoading && times(3, (i) => (
            <li className={styles.item} key={i}>
              <EndpointsListItemPlaceholder />
            </li>
          ))}
          {endpoints.data?.map((endpoint) => (
            <li className={styles.item} key={endpoint.id}>
              <EndpointsListItem
                endpoint={endpoint}
                selected={endpoint.id === selectedEndpoint?.id}
                onClick={() => setSelectedEndpoint(endpoint)}
              />
            </li>
          ))}
          {endpoints.data?.length === 0 && (
            <Alert appearance="default" className={styles.endpointsEmpty}>
              There are no compute endpoints in the project
            </Alert>
          )}
        </ul>
        <div className={styles.actions}>
          <Button
            className={styles.actionButton}
            appearance="secondary"
            onClick={onBack}
            size="l"
          >
            Back
          </Button>
          <Button
            className={styles.actionButton}
            appearance="primary"
            disabled={!selectedEndpoint}
            onClick={() => onSubmit(
              selectedEndpoint!,
              project!,
            )}
            size="l"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
