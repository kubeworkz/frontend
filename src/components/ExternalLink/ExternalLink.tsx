import React, { useState } from 'react';
import { AnyLink, AnyLinkConfig } from '../../components/AnyLink/AnyLink';
import { IconName, SvgIcon } from '../../components/SvgIcon/SvgIcon';

import { DOCUMENTATION_URL, WEBSITE_URL } from '../../config/config';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';

import { SupportFormModal } from '../../components/SupportForm/SupportFormModal';
import styles from './ExternalLink.module.css';

type ExternalLinkProp = {
  iconName: IconName;
} & AnyLinkConfig;

export const ExternalLink = ({ iconName, children, ...props }: ExternalLinkProp) => (
  <AnyLink
    {...props}
    className={styles.root}
  >
    <SvgIcon name={iconName} className={styles.icon} />
    {children}
  </AnyLink>
);

export const ExternalLinkDocumentation = React.memo(() => (
  <ExternalLink
    iconName="question-mark-28"
    as="a"
    target="_blank"
    href={DOCUMENTATION_URL}
  >
    Documentation
  </ExternalLink>
));

interface ExternalLinkSupportProps {
  subject?: string;
  content?: string;
}

export const ExternalLinkSupport = React.memo(({ subject, content }: ExternalLinkSupportProps) => {
  const { trackUiInteraction } = useAnalytics();
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <>
      <SupportFormModal
        onRequestClose={() => {
          trackUiInteraction(AnalyticsAction.SupportFormDismissed);
          setIsFormVisible(false);
        }}
        isOpen={isFormVisible}
        title="Report a problem"
        formProps={{
          initialData: {
            subject, content,
          },
        }}
      />
      <ExternalLink
        iconName="lifebuoy-28"
        as="button"
        onClick={() => {
          trackUiInteraction(AnalyticsAction.ErrorPageContactSupportClicked);
          setIsFormVisible(true);
        }}
      >
        Contact support
      </ExternalLink>
    </>
  );
});

ExternalLinkSupport.displayName = 'ExternalLinkSupport';

export const ExternalLinkWebsite = React.memo(() => (
  <ExternalLink
    iconName="paper-28"
    as="a"
    target="_blank"
    href={WEBSITE_URL}
  >
    Visit website
  </ExternalLink>
));
