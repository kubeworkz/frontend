import React, { useState } from 'react';
import { apiService, Endpoint } from '../../api/publicv2';
import { ActionsDropdownItem } from '../../components/ActionsDropdown/ActionDropdownItem/ActionsDropdownItem';
import {
  ConfirmationPreset,
  createConfirmation, useConfirmation,
} from '../../components/Confirmation/ConfirmationProvider';
import { ActionsDropdown } from '../../components/ActionsDropdown/ActionsDropdown';
import { apiErrorToaster } from '../../api/utils';
import { EndpointFormModal } from '../EndpointForm/EndpointFormModal';
import { useProjectEndpoints } from '../../app/hooks/projectEndpoints';

interface EndpointActionsDropdownProps {
  endpoint: Endpoint;
  onDeleteEndpoint?(): void;
}

export const EndpointActionsDropdown = ({
  endpoint,
  onDeleteEndpoint,
}: EndpointActionsDropdownProps) => {
  const { confirm } = useConfirmation();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { fetch } = useProjectEndpoints();

  const onClickEdit = React.useCallback(() => {
    setIsFormVisible(true);
  }, []);

  const closeForm = React.useCallback(() => {
    setIsFormVisible(false);
  }, []);

  const onClickDelete = React.useCallback(
    () => {
      confirm(createConfirmation(ConfirmationPreset.DeleteEndpoint, endpoint))
        .then(() => apiService.deleteProjectEndpoint(endpoint.project_id, endpoint.id))
        .then(() => onDeleteEndpoint && onDeleteEndpoint())
        .catch(apiErrorToaster);
    },
    [endpoint, onDeleteEndpoint],
  );

  return (
    <>
      <EndpointFormModal
        isOpen={isFormVisible}
        onRequestClose={closeForm}
        formProps={{
          onSuccess: () => {
            fetch();
            closeForm();
          },
          endpoint,
        }}
      />
      <ActionsDropdown>
        <ActionsDropdownItem
          as="button"
          onClick={onClickEdit}
        >
          Edit
        </ActionsDropdownItem>
        <ActionsDropdownItem
          as="button"
          onClick={onClickDelete}
        >
          Delete
        </ActionsDropdownItem>
      </ActionsDropdown>
    </>
  );
};
