import React, { useCallback, useState } from 'react';

import { Button } from '../../../components/Button/Button';
import { apiErrorToaster } from '../../../api/utils';
import { useQueryContext } from '../../../app/pages/Query/queryContext';
import { QuerySaveDialog } from './QuerySaveDialog';

export const QuerySaveButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const {
    actions: { saveQuery },
    state: { selectedQueryName, selectedQueryId, queryChanged },
  } = useQueryContext();

  const onHide = useCallback(() => setShowDialog(false), []);
  const onShowClick = useCallback(() => {
    if (selectedQueryName) {
      saveQuery(selectedQueryId, selectedQueryName);
    } else {
      setShowDialog(true);
    }
  }, [selectedQueryName, saveQuery]);

  const onSaveQuery = useCallback(
    (name: string) => saveQuery(null, name).then(onHide).catch(apiErrorToaster),
    [saveQuery, onHide],
  );

  return (
    <>
      <Button
        type="button"
        disabled={Boolean(selectedQueryName && !queryChanged)}
        size="m"
        appearance="secondary"
        icon="save_16"
        onClick={onShowClick}
      >
        Save
      </Button>
      <QuerySaveDialog
        key={selectedQueryName}
        isOpen={showDialog}
        proposedName={selectedQueryName || 'New Query'}
        onClose={onHide}
        onSaveQuery={onSaveQuery}
      />
    </>
  );
};
