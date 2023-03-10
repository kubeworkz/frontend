import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { AnyLink } from '#shared/components/AnyLink/AnyLink';

import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import styles from './LimitedPreviewBanner.module.css';

export const LimitedPreviewBanner = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  const { trackUiInteraction } = useAnalytics();
  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.container}>
        <span className={styles.text}>
          You are participating in Neon Technical Preview.
        </span>
        <AnyLink
          className={styles.link}
          as="a"
          href="https://cloudrock.ca/docs/reference/technical-preview-free-tier/"
          target="_blank"
          onClick={() => trackUiInteraction(AnalyticsAction.TechPreviewReadMoreClicked)}
        >
          Read more
        </AnyLink>
      </div>
    </div>
  );
};
