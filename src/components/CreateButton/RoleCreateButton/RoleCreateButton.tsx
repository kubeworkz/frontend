import React, { useState } from 'react';
import { ButtonProps } from '#shared/components/Button/Button';
import { ComponentWithAsProp } from '#shared/types/Props';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { CreateButton } from '../CreateButton';
import { RoleFormModal } from '../../RoleForm/RoleFormModal';
import { withDisableOnTransition } from '../../withDisableOnTransition/withDisableOnTransition';

const TransitionButton = withDisableOnTransition(CreateButton);

export const RoleCreateButton: ComponentWithAsProp<'button', ButtonProps> = ({ children, ...props }: ButtonProps) => {
  const { trackUiInteraction } = useAnalytics();
  const [formIsVisible, setFormIsVisible] = useState(false);

  const closeModal = React.useCallback(() => setFormIsVisible(false), []);
  const openModal = React.useCallback(() => {
    trackUiInteraction(AnalyticsAction.CreateUserButtonClicked);
    setFormIsVisible(true);
  }, []);

  return (
    <>
      <RoleFormModal
        isOpen={formIsVisible}
        onRequestClose={closeModal}
      />
      <TransitionButton
        {...props}
        onClick={openModal}
      >
        {children || 'New Role'}
      </TransitionButton>
    </>
  );
};
