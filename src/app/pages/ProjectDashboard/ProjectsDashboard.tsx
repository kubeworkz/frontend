import React from 'react';
import { useNewItemModals } from '../../../hooks/useNewItem';
import { ProjectComputeWidget } from '../../../components/ProjectWidgets/ProjectComputeWidget/ProjectComputeWidget';
import { ProjectOperationsWidget } from '../../../components/ProjectWidgets/ProjectOperationsWidget';
import {
  ProjectConnectionWidget,
} from '../../../components/ProjectWidgets/ProjectConnectionWidget/ProjectConnectionWidget';
import { ProjectPostgresWidget } from '../../../components/ProjectWidgets/ProjectPostgresWidget/ProjectPostgresWidget';

import { ProjectBranchesWidget } from '../../../components/ProjectWidgets/ProjectBranchesWidget/ProjectBranchesWidget';
import { ProjectTierWidget } from '../../../components/ProjectWidgets/ProjectTierWidget/ProjectTierWidget';
import styles from './ProjectsDashboard.module.css';

export const ProjectsDashboard = () => {
  const modal = useNewItemModals('project');

  return (
    <>
      {modal}
      <div className={styles.container}>
        <div className={styles.col}>
          <ProjectConnectionWidget />
          <ProjectOperationsWidget />
        </div>
        <div className={styles.col}>
          <ProjectBranchesWidget />
          <ProjectTierWidget />
          <ProjectComputeWidget />
          <ProjectPostgresWidget />
        </div>
      </div>
    </>
  );
};
