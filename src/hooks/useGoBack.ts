import React from 'react';
import { useHistory } from 'react-router';

export const useGoBack = (fallbackURL: string = '/') => {
  const history = useHistory();

  return React.useCallback(() => {
    if (history.length) {
      history.goBack();
    } else {
      history.push(fallbackURL);
    }
  }, []);
};
