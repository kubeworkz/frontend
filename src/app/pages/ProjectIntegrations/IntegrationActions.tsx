import React, { useCallback } from 'react';

import { ExternalIntegration, OAuthApplication } from '../../../api/publicv2';
import { Button } from '../../../components/Button/Button';
import { useProjectIntegrations } from '../../hooks/projectIntegrations';

type IntegrationActionsProps = {
  app: OAuthApplication | ExternalIntegration;
};
export const IntegrationActions = ({ app }: IntegrationActionsProps) => {
  const { revokeIntegration } = useProjectIntegrations();
  const onRevoke = useCallback(() => {
    revokeIntegration(app);
  }, [revokeIntegration, app]);
  return (
    <Button
      appearance="error"
      size="s"
      onClick={onRevoke}
    >
      Revoke
    </Button>
  );
};
