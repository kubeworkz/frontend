import React from 'react';
import { ErrorProps } from '../components/Error/Error';
import { PageError } from '../components/PageError/PageError';
import { StaticRouter } from 'react-router';
import { LayoutCentered } from '../components/Layout/LayoutCentered/LayoutCentered';

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
