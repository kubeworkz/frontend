import React from 'react';

import '../../styles/basic.css';
import '../../styles/theme.light.scss';

import { PageError } from '../../components/PageError/PageError';
import { AnyLink } from '../../components/AnyLink/AnyLink';
import { Button } from '../../components/Button/Button';
import { LayoutCentered } from '../../components/Layout/LayoutCentered/LayoutCentered';

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
          The Cloudrock console is currently under maintenance
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
