import React from 'react';

import '#shared/styles/basic.css';
import '#shared/styles/theme.light.scss';

import { PageError } from '#shared/components/PageError/PageError';
import { AnyLink } from '#shared/components/AnyLink/AnyLink';
import { Button } from '#shared/components/Button/Button';
import { LayoutCentered } from '#shared/components/Layout/LayoutCentered/LayoutCentered';

import img from '../assets/maintenance.webp';

export const Maintenance = () => (
  <LayoutCentered
    showHelp={false}
    showLimitedPreviewBanner={false}
    logoLinkConfig={{
      as: 'div',
    }}
    hideUser
  >
    <PageError
      imgSrc={img}
      title="Under Maintenance"
      subtitle={(
        <>
          The Neon console is currently under maintenance
          <br />
          and will be back soon. Check
          {' '}
          <AnyLink as="a" target="_blank" href="https://cloudrock.ca">
            <Button appearance="default" as="span">
              https://cloudrock.ca
            </Button>
          </AnyLink>
          {' '}
          or follow
          {' '}
          <br />
          <AnyLink as="a" target="_blank" href="https://twitter.com/cloudrockdatabase">
            <Button appearance="default" as="span">
              @cloudrockdatabase
            </Button>
          </AnyLink>
          {' '}
          on Twitter for updates.
        </>
      )}
    />
  </LayoutCentered>
);
