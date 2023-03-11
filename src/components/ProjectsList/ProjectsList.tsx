import React from 'react';

import { FormCheckbox } from '../../components/Form/FormCheckbox/FormCheckbox';
import { FormRadio } from '../../components/Form/FormRadio/FormRadio';

import { ConsentProps, Scope } from '../../types';

import styles from './ProjectsList.module.css';

const ProjectLayout = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.layout}>{children}</div>
);

const ProjectLayoutCheckbox = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.layoutCheckbox}>{children}</div>
);

const ProjectLayoutTitle = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.layoutTitle}>{children}</div>
);

const ProjectLayoutFooter = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.layoutFooter}>{children}</div>
);

const ProjectFooterItem = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.footerItem}>{children}</span>
);

export const ProjectSelect = ({
  projectsSelection: selectProjects,
  project,
}: {
  projectsSelection: ConsentProps['projectsSelection'];
  project: Scope;
}) => (
  <ProjectLayout>
    {selectProjects === 'single' && (
      <ProjectLayoutCheckbox>
        <FormRadio className={styles.radio} name="projects" value={`urn:cloudrockcloud:${project.id}:all`} />
      </ProjectLayoutCheckbox>
    )}
    {selectProjects === 'multiple' && (
      <ProjectLayoutCheckbox>
        <FormCheckbox radioGroup="projects" name="projects" value={`urn:cloudrockcloud:${project.id}:all`} />
      </ProjectLayoutCheckbox>
    )}
    <ProjectLayoutTitle>{project.label}</ProjectLayoutTitle>
    <ProjectLayoutFooter>
      <ProjectFooterItem>{project.id}</ProjectFooterItem>
      {/* <ProjectFooterItem>
            {project.platform_name}
          </ProjectFooterItem>
          <ProjectFooterItem>
            {project.region_name}
          </ProjectFooterItem>
          */}
    </ProjectLayoutFooter>
  </ProjectLayout>
);

export const ProjectsList = ({ projects, projectsSelection }: ConsentProps) => (
  <div className={styles.root}>
    {projects.map((project) => (
      <ProjectSelect
        key={project.id}
        project={project}
        projectsSelection={projectsSelection}
      />
    ))}
  </div>
);
