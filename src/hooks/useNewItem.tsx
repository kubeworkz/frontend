import React, {
  createContext, PropsWithChildren, useContext, useState,
} from 'react';
import {
  BranchResponse,
  ConnectionURIsResponse, DatabasesResponse, EndpointsResponse, OperationsResponse,
  ProjectResponse,
  RoleResponse, RolesResponse,
} from '#api_client/generated/api_public_v2';
import { NewItemModalRole } from '#shared/components/NewItemModal/NewItemModalRole/NewItemModalRole';
import { NewItemModalBranch } from '#shared/components/NewItemModal/NewItemModalBranch/NewItemModalBranch';
import { NewItemModalProject } from '../components/NewItemModal/NewItemModalProject/NewItemModalProject';

export type ProjectData = ProjectResponse &
ConnectionURIsResponse &
RolesResponse &
DatabasesResponse &
OperationsResponse &
BranchResponse &
EndpointsResponse;

type BranchData = BranchResponse & EndpointsResponse & OperationsResponse;

type RoleData = RoleResponse & OperationsResponse;

interface NewItemContextInterface {
  setProjectData(data?: ProjectData): void;
  setBranchData(data?: BranchData): void;
  setRoleData(data?: RoleData): void;
  projectData?: ProjectData;
  branchData?: BranchData;
  roleData?: RoleData;
}

const NewItemContext = createContext<NewItemContextInterface>({
  setProjectData: () => {},
  setBranchData: () => {},
  setRoleData: () => {},
});

export const NewItemProvider = ({ children }: PropsWithChildren<{}>) => {
  const [projectData, setProjectData] = useState<ProjectData>();
  const [branchData, setBranchData] = useState<BranchData>();
  const [roleData, setRoleData] = useState<RoleData>();

  return (
    <NewItemContext.Provider
      value={{
        setProjectData,
        setBranchData,
        setRoleData,
        projectData,
        branchData,
        roleData,
      }}
    >
      {children}
    </NewItemContext.Provider>
  );
};

export const useNewItemsCallbacks = () => {
  const context = useContext(NewItemContext);

  return {
    onProjectCreate: context.setProjectData,
    onBranchCreate: context.setBranchData,
    onRoleCreate: context.setRoleData,
  };
};

export const useNewItemModals = (type: 'project' | 'branch' | 'role') => {
  const context = useContext(NewItemContext);

  const onClose = React.useCallback(() => {
    if (type === 'project') {
      context.setProjectData();
      return;
    }
    if (type === 'branch') {
      context.setBranchData();
    }
    if (type === 'role') {
      context.setRoleData();
    }
  }, [type]);

  const modal = React.useMemo(() => {
    if (type === 'project' && context.projectData) {
      return (
        <NewItemModalProject
          data={context.projectData}
          isOpen={!!context.projectData}
          onRequestClose={onClose}
        />
      );
    }

    if (type === 'role' && context.roleData) {
      return (
        <NewItemModalRole
          data={context.roleData}
          isOpen={!!context.roleData}
          onRequestClose={onClose}
        />
      );
    }

    if (type === 'branch' && context.branchData) {
      return (
        <NewItemModalBranch
          data={context.branchData}
          isOpen={!!context.branchData}
          onRequestClose={onClose}
        />
      );
    }

    return null;
  }, [type, context.projectData, context.branchData, context.roleData, onClose]);

  React.useEffect(() => onClose, [type]);

  return modal;
};
