import React from 'react';
import {
  Branch,
  Endpoint,
} from '#api_client/publicv2';

// import { Button } from '#shared/components/Button/Button';
import { DataTable } from '#shared/components/DataTable/DataTable';
// import { generatePath } from 'react-router-dom';
// import { ConsoleRoutes } from '#shared/routes';
// import { AnyLink } from '#shared/components/AnyLink/AnyLink';
// import { usePlatforms } from '#shared/hooks/platforms';
import { EndpointStatusBadge } from '#shared/components/EndpointStatusBadge/EndpointStatusBadge';
import { createActionsCol } from '#shared/components/DataTable/utils';
import { CopyButton } from '#shared/components/CopyButton/CopyButton';
// import { Skeleton } from '#shared/components/Skeleton/Skeleton';
// import { useProjectsItemContext } from '../../../hooks/projectsItem';
import { EndpointActionsDropdown } from '../../EndpointActionsDropdown/EndpointActionsDropdown';

import { EndpointCreateButton } from '../../CreateButton/EndpointCreateButton/EndpointCreateButton';
import styles from './BranchViewEndpoints.module.css';

interface BranchViewEndpointsProps {
  endpoints: Endpoint[];
  branchId: Branch['id'];
  onDeleteEndpoint?: () => void;
  onCreateEndpoint?: () => void;
  isLoading?: boolean;
}

export const BranchViewEndpoints = (props: BranchViewEndpointsProps) => {
  // const { projectId } = useProjectsItemContext();
  // const { getRegion } = usePlatforms();

  const cols = React.useMemo(() => ([
    {
      label: 'Host',
      key: 'id',
      renderValue: (e: Endpoint) => {
        const { host } = e;
        return (
          <div className={styles.hostCol}>
            <b>{host}</b>
            <CopyButton text={host} />
          </div>
        );
      },
    },
    {
      label: 'Region',
      key: 'region_id',
      // renderValue: (e: Endpoint) => {
      //   const region = getRegion(e.platform_id, e.region_id);
      //
      //   return region?.name || 'unknown';
      // },
    },
    {
      label: 'Type',
      key: 'type',
    },
    {
      label: 'State',
      key: 'state',
      renderValue: (e: Endpoint) => (
        <EndpointStatusBadge
          endpoint={e}
        />
      ),
    },
    createActionsCol((e: Endpoint) => (
      <EndpointActionsDropdown
        endpoint={e}
        onDeleteEndpoint={props.onDeleteEndpoint}
      />
    )),
  ]), []);

  if (props.isLoading) {
    return (
      // <>
      //   <div className={styles.header}>
      //     <div className={styles.title}><Skeleton width={138} height={18} /></div>
      //   </div>
      <DataTable
        className={styles.table}
        data={[]}
        isLoading
        cols={cols}
      />
      // </>
    );
  }

  return (
    <>
      {/* <div className={styles.header}> */}
      {/*  <div className={styles.title}>Endpoints</div> */}
      {/* {!!props.endpoints.length && ( */}
      {/*  <div className={styles.actions}> */}
      {/*    <AnyLink */}
      {/*      to={generatePath(ConsoleRoutes.ProjectsItemBranchesItemEndpointsNew, { */}
      {/*        projectId, */}
      {/*        branchId: props.branchId, */}
      {/*      })} */}
      {/*    > */}
      {/*      <Button */}
      {/*        appearance="default" */}
      {/*      > */}
      {/*        Add new compute endpoint */}
      {/*      </Button> */}
      {/*    </AnyLink> */}
      {/*  </div> */}
      {/* )} */}
      {/* </div> */}
      <DataTable
        className={styles.table}
        data={props.endpoints}
        cols={cols}
        dataPlaceholderProps={{
          title: 'This branch has no compute endpoints',
          subtitle: 'Create new compute endpoint to connect to the branch from your application.',
          actions: (
            <EndpointCreateButton
              branchId={props.branchId}
              onCreate={props.onCreateEndpoint}
            >
              Add new compute endpoint
            </EndpointCreateButton>
          ),
        }}
      />
    </>
  );
};
