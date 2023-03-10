import React from 'react';

import { Project } from '#api_client/publicv2';
import { usePlatforms } from '#shared/hooks/platforms';
import { FormRadio } from '#shared/components/Form/FormRadio/FormRadio';
import styles from './ProjectsListItem.module.css';

interface ProjectsListItemProps {
  selected: boolean;
  project: Project;
  onClick(): void;
}

export const ProjectsListItem = ({ project, selected, onClick }: ProjectsListItemProps) => {
  const { instanceTypesByPlatform } = usePlatforms();
  const instance = instanceTypesByPlatform[project.platform_id]
    .find((instType) => String(instType.id) === project.platform_id);
  return (
    <button type="button" className={styles.root} onClick={onClick}>
      <FormRadio id={`radio-${project.id}`} className={styles.radio} checked={selected} readOnly />
      <div className={styles.main}>
        <div className={styles.name}>{project.name}</div>
        <ul className={styles.features}>
          <li className={styles.feature_item}>{project.region_id}</li>
          <li className={styles.feature_item}>{project.platform_id}</li>
          {instance && (
          <li className={styles.feature_item}>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {instance.vcpu_count}vCPU/{instance.memory_size}mb
          </li>
          )}
        </ul>
      </div>
    </button>
  );
};
