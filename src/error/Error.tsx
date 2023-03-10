import React from 'react';
import { ErrorProps } from '#shared/components/Error/Error';
import { PageError } from '#shared/components/PageError/PageError';
import { StaticRouter } from 'react-router';
import { LayoutCentered } from '#shared/components/Layout/LayoutCentered/LayoutCentered';

export const Error = (props: ErrorProps) => (
  <StaticRouter>
    <LayoutCentered
      logoLinkConfig={{
        as: 'a',
        href: '/',
      }}
      hideUser
    >
      <PageError {...props} />
    </LayoutCentered>
  </StaticRouter>
);
