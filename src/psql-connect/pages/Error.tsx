import React from 'react';
import { PageError } from '#shared/components/PageError/PageError';
// import { Button } from '#shared/components/Button/Button';
import {
  ExternalLinkDocumentation,
  ExternalLinkSupport,
  // ExternalLinkWebsite
} from '#shared/components/ExternalLink/ExternalLink';
import { useConnectAppContext } from '../context/connectApp';
import img from '../assets/connection_failed.webp';

export const Error = () => {
  const { connectedProject: project, connectedEndpoint, psqlSessionId } = useConnectAppContext();

  return (
    <PageError
      imgSrc={img}
      title="Connection failed"
      subtitle={(
        <>
          Your psql session failed to connect to the project
          {project ? (
            <>
              {' '}
              <b>{project.name}</b>
            </>
          ) : ''}
          ,
          <br />
          check out our docs or contact support.
        </>
      )}
      // actions={
      //   <Button>Retry connection</Button>
      // }
      footerLinks={[
        <ExternalLinkDocumentation />,
        <ExternalLinkSupport
          subject="Psql session failed to connect to the project"
          content={`PSQL session id: ${psqlSessionId},\nProject id: ${project?.id || 'unknown'},\nEndpoint id: ${connectedEndpoint?.id},\n`}
        />,
      ]}
    />
  );
};
