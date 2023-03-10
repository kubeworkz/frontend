import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Project } from '#api_client/publicv2';
import { Button } from '#shared/components/Button/Button';
import { PageError } from '#shared/components/PageError/PageError';
import {
  ExternalLinkDocumentation,
  ExternalLinkWebsite,
} from '#shared/components/ExternalLink/ExternalLink';
import { useCurrentUser } from '#shared/hooks/currentUser';
import { useSettings } from '#shared/hooks/settings';
import { AnyLink } from '#shared/components/AnyLink/AnyLink';

import { PsqlConnectRoutes } from '../../config/routes';
import img from '../../assets/welcome.webp';
import { ProjectsListItem } from './ProjectsListItem/ProjectsListItem';
import styles from './ProjectsList.module.css';

interface ProjectsListProps {
  projects: Project[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  const history = useHistory();
  const {
    user: { projectsLimit },
  } = useCurrentUser();
  const {
    flags: { projectCreationForbidden },
  } = useSettings();

  const goToProjectForm = React.useCallback(() => {
    history.push(PsqlConnectRoutes.NewProject);
  }, []);

  const projectLimitExceeded = React.useMemo(
    () => projectCreationForbidden
      || (typeof projectsLimit === 'number' && projects.length >= projectsLimit),
    [projects, projectsLimit, projectCreationForbidden],
  );

  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  const onNext = useCallback(() => {
    history.push(PsqlConnectRoutes.Endpoints, { project: selectedProject });
  }, [selectedProject]);

  if (!projects.length) {
    return (
      <PageError
        imgSrc={img}
        title={
          projectLimitExceeded
            ? 'You can not create new projects'
            : 'Welcome to Neon'
        }
        subtitle={
          projectLimitExceeded
          && 'Unfortunately, you can not create new projects'
        }
        actions={(
          <Button onClick={goToProjectForm} disabled={projectLimitExceeded}>
            Create the first project
          </Button>
        )}
        footerLinks={[
          <ExternalLinkDocumentation />,
          // <ExternalLinkSupport />,
          <ExternalLinkWebsite />,
        ]}
      />
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <h2 className={styles.header}>Creating the project connection</h2>
        <div className={styles.subheader}>
          Select an existing project to connect
          {' '}
          {!projectLimitExceeded && (
            <>
              or
              {' '}
              <AnyLink
                className={styles.newProjectLink}
                as="button"
                onClick={goToProjectForm}
              >
                create a new one
              </AnyLink>
            </>
          )}
        </div>
        <ul className={styles.list}>
          {projects.map((project) => (
            <li className={styles.item} key={project.id}>
              <ProjectsListItem
                project={project}
                selected={project.id === selectedProject?.id}
                onClick={() => setSelectedProject(project)}
              />
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button
            appearance="primary"
            disabled={!selectedProject}
            onClick={onNext}
            size="l"
            wide
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
