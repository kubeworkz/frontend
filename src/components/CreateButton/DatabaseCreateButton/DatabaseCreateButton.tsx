import React, { useState } from 'react';
import { ButtonProps } from '#shared/components/Button/Button';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { CreateButton } from '../CreateButton';

import { DatabaseFormModal } from '../../DatabaseForm/DatabaseFormModal';
import { withDisableOnTransition } from '../../withDisableOnTransition/withDisableOnTransition';

const TransitionButton = withDisableOnTransition(CreateButton);

export const DatabaseCreateButton = ({ children, ...props }: ButtonProps) => {
  const { trackUiInteraction } = useAnalytics();

  const [formIsVisible, setFormIsVisible] = useState(false);

  const closeModal = React.useCallback(() => setFormIsVisible(false), []);
  const openModal = React.useCallback(() => {
    trackUiInteraction(AnalyticsAction.CreateDatabaseButtonClicked);
    setFormIsVisible(true);
  }, []);

  return (
    <>
      <DatabaseFormModal
        isOpen={formIsVisible}
        onRequestClose={closeModal}
        formProps={{
          onSuccess: closeModal,
        }}
      />
      <TransitionButton
        {...props}
        onClick={openModal}
        data-qa="database_create_button"
      >
        {children || 'New Database'}
      </TransitionButton>
    </>
  );
};
