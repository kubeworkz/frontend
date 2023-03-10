import React from 'react';
import {
  apiService,
  Branch,
} from '../../../api/publicv2';
import { generatePath, useParams } from 'react-router-dom';
import { createErrorText } from '../../../api/utils';
import { useResource } from '../../../utils/useResource';
import { ConsoleRoutes } from '../../../routes/routes';
import { useHistory } from 'react-router';
import { PageError } from '../../../components/PageError/PageError';
import { useNewItemModals } from '../../../hooks/useNewItem';
import { useBranches } from '../../../hooks/projectBranches';
// import {
//   BranchViewColumns,
//   BranchViewColumnsSkeleton,
// } from '../../components/BranchView/BranchViewColumns/BranchViewColumns';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { useProjectEndpoints } from '../../hooks/projectEndpoints';
import {
  BranchView,
  BranchViewSkeleton,
} from '../../../components/BranchView/BranchView';

export const ProjectBranchesItem = () => {
  const { branchId, projectId } = useParams<{ branchId: string; projectId: string }>();
  const { isLoading: isProjectLoading } = useProjectsItemContext();
  const { branchesById, fetch: fetchBranchesList } = useBranches();
  const {
    endpointsByBranchId,
    isLoading: isEndpointsLoading,
    fetch: fetchEndpoints,
  } = useProjectEndpoints();
  const history = useHistory();
  const modal = useNewItemModals('branch');

  const getCachedBranch = React.useCallback(() => {
    if (branchesById[branchId] && branchesById[branchId].project_id === projectId) {
      return branchesById[branchId];
    }
    return undefined;
  }, [branchId, projectId, branchesById]);

  const [branch, setBranch] = useResource<Branch>();

  const isLoading = isProjectLoading || branch.isLoading || isEndpointsLoading;

  const fetchBranch = () => {
    apiService.getProjectBranch(projectId, branchId)
      .then(({ data }) => {
        if (data.branch.project_id === projectId) {
          setBranch({
            isLoading: false,
            data: data.branch,
          });
        } else {
          setBranch({
            isLoading: false,
            error: "Branch doesn't belong to the project",
          });
        }
      }).catch((err) => {
        const errText = createErrorText(err);
        setBranch({
          isLoading: false,
          error: errText,
        });
      });
  };

  React.useEffect(() => {
    const preloadedBranch = getCachedBranch();
    setBranch({
      data: preloadedBranch,
      isLoading: !preloadedBranch,
    });

    fetchBranch();
  }, [projectId, branchId]);

  if (isLoading) {
    return <BranchViewSkeleton />;
  }

  if (branch.error || !branch.data) {
    return (
      <PageError
        title={branch.error}
      />
    );
  }

  return (
    <>
      {modal}
      <BranchView
        branch={branch.data}
        onRenameBranch={() => {
          fetchBranchesList();
          fetchBranch();
        }}
        onDeleteBranch={() => {
          fetchBranchesList();
          history.push(generatePath(ConsoleRoutes.ProjectsItemBranches, { projectId }));
        }}
        endpoints={endpointsByBranchId[branchId] || []}
        onDeleteEndpoint={fetchEndpoints}
        onCreateEndpoint={fetchEndpoints}
      />
    </>
  );
};
