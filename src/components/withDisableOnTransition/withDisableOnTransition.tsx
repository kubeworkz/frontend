import { Tippy } from '../../components/Tippy/Tippy';
import React from 'react';
import { useProjectEndpoints } from '../../app/hooks/projectEndpoints';
import { useSelectedBranch } from '../../app/hooks/selectedBranchProvider';

import style from './DisableOnTransition.module.css';

export function withDisableOnTransition<P>(Component: React.ComponentType<P>) {
  const wrapped = (props: P) => {
    const { branch } = useSelectedBranch();
    const { endpointsByBranchId } = useProjectEndpoints();

    if (!branch) {
      return null;
    }

    const endpoint = endpointsByBranchId[branch?.id]?.[0];

    const inactive = Boolean(endpoint?.pending_state);

    return (
      <Tippy
        content={endpoint ? 'Project is currently in the transition state' : 'You need a compute endpoint to use this feature'}
        disabled={!inactive}
      >
        <div className={inactive ? style.disabled : ''}>
          <Component
            {...props}
            disabled={Boolean((props as any).disabled || inactive)}
          />
        </div>
      </Tippy>
    );
  };
  wrapped.displayName = `withDisableOnTransition(${Component.displayName})`;
  return wrapped;
}
