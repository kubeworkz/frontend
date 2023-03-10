import React, { useState } from 'react';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { SupportFormModal } from '#shared/components/SupportForm/SupportFormModal';
import { FeedbackFormModal } from '#shared/components/FeedbackForm/FeedbackFormModal';
import { COMMUNITY_URL, DOCUMENTATION_URL, RELEASE_NOTES_URL } from '#shared/config';
import { MenuItem } from './MenuItem';

export const MenuItemSupport = () => {
  const { trackUiInteraction } = useAnalytics();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <SupportFormModal
        onRequestClose={() => {
          trackUiInteraction(AnalyticsAction.SupportFormDismissed);
          setIsModalVisible(false);
        }}
        isOpen={isModalVisible}
      />
      <MenuItem
        iconName="help_20"
        as="button"
        onClick={() => setIsModalVisible(true)}
      >
        Support
      </MenuItem>
    </>
  );
};

export const MenuItemFeedback = () => {
  const { trackUiInteraction } = useAnalytics();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <FeedbackFormModal
        onRequestClose={() => {
          trackUiInteraction(AnalyticsAction.FeedbackFormDismissed);
          setIsModalVisible(false);
        }}
        isOpen={isModalVisible}
      />
      <MenuItem
        iconName="chat_20"
        as="button"
        onClick={() => setIsModalVisible(true)}
      >
        Feedback
      </MenuItem>
    </>
  );
};

export const MenuItemCommunity = () => {
  const { trackUiInteraction } = useAnalytics();

  return (
    <MenuItem
      iconName="feedback_20"
      as="a"
      target="_blank"
      href={COMMUNITY_URL}
      onClick={() => trackUiInteraction(AnalyticsAction.HelpCommunityLinkClicked)}
    >
      Community
    </MenuItem>
  );
};

export const MenuItemDocumentation = () => {
  const { trackUiInteraction } = useAnalytics();

  return (
    <MenuItem
      iconName="docs_20"
      as="a"
      target="_blank"
      href={DOCUMENTATION_URL}
      onClick={() => trackUiInteraction(AnalyticsAction.HelpDocumentationLinkClicked)}
    >
      Docs
    </MenuItem>
  );
};

export const MenuItemReleaseNotes = () => {
  const { trackUiInteraction } = useAnalytics();

  return (
    <MenuItem
      iconName="release_20"
      as="a"
      target="_blank"
      href={RELEASE_NOTES_URL}
      onClick={() => trackUiInteraction(AnalyticsAction.HelpReleaseNotesLinkClicked)}
    >
      Release notes
    </MenuItem>
  );
};
