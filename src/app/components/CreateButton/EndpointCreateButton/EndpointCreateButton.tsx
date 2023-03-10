import React, { useState } from 'react';
import { Button, ButtonProps } from '#shared/components/Button/Button';
import { Tippy } from '#shared/components/Tippy/Tippy';
import {
  Branch, Endpoint,
} from '#api_client/publicv2';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { getLimitsLabel, useUserEndpointsLimit } from '../../../hooks/userLimits';
import { useProjectsItemContext } from '../../../hooks/projectsItem';
import { EndpointFormModal } from '../../EndpointForm/EndpointFormModal';
import { useProjectEndpoints } from '../../../hooks/projectEndpoints';

interface EndpointCreateButtonProps {
  branchId?: Branch['id'],
  onCreate?(e: Endpoint): void;
}

export const EndpointCreateButton = ({
  children, branchId, onCreate, ...props
}: ButtonProps & EndpointCreateButtonProps) => {
  const { projectId, project } = useProjectsItemContext();
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const limitsData = useUserEndpointsLimit();
  const { fetch } = useProjectEndpoints();
  const { trackUiInteraction } = useAnalytics();

  const onClick = React.useCallback(() => {
    trackUiInteraction(AnalyticsAction.CreateEndpointButtonClicked);
    setCreateFormVisible(true);
  }, [branchId, onCreate, projectId]);

  if (limitsData.isLoading || !project) {
    return null;
  }

  const limitsLabel = getLimitsLabel(limitsData);

  const button = (
    <Button
      {...props}
      disabled={limitsData.isLimitExceeded}
      onClick={onClick}
    >
      {children}
      {limitsLabel ? ` ${limitsLabel}` : ''}
    </Button>
  );

  return (
    <>
      <EndpointFormModal
        isOpen={createFormVisible}
        onRequestClose={() => setCreateFormVisible(false)}
        formProps={{
          onSuccess: () => {
            fetch();
            setCreateFormVisible(false);
          },
          projectId,
          branchId,
        }}
      />
      <Tippy
        content={limitsData.message}
        placement="bottom"
        disabled={!limitsData.message}
      >
        <div style={{ display: 'inline-block' }}>
          {button}
        </div>
      </Tippy>
    </>
  );
};
