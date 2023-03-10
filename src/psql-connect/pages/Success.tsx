import React from 'react';
import { PageError } from '../../components/PageError/PageError';
import { Button } from '../../components/Button/Button';
import { generatePath } from 'react-router-dom';
import {
  ExternalLinkDocumentation,
} from '../../components/ExternalLink/ExternalLink';
import { ConsoleRoutes, CONSOLE_BASE_ROUTE } from '../../routes/routes';
import { useConnectAppContext } from '../context/connectApp';

import img from '../assets/connection_succeed.webp';

export const Success = () => {
  const { connectedProject: project } = useConnectAppContext();

  if (!project) {
    return <PageError />;
  }

  return (
    <PageError
      imgSrc={img}
      title="Check your terminal"
      subtitle={(
        <>
          Your psql session should be connected to the project
          {' '}
          <b>{project.name}</b>
          <br />
          you can go back to the console.
        </>
      )}
      actions={(
        <Button
          as="a"
          href={CONSOLE_BASE_ROUTE
            + generatePath(ConsoleRoutes.ProjectsItem, { projectId: project.id })}
        >
          Go to dashboard
        </Button>
      )}
      footerLinks={<ExternalLinkDocumentation />}
    />
  );
};
