import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useCurrentUser } from '../../hooks/currentUser';
import { BillingSubscriptionType } from '../../api/generated/api_public_v2';
import { useHistory, useLocation } from 'react-router';
import { useAppContext } from '../../app/hooks/app';

export type EnrollToProContextI = {
  enrollToProAvailable: boolean;
  isPromoVisible: boolean;
  setIsPromoVisible(v: boolean): void;
};

export const EnrollToProContext = createContext<EnrollToProContextI>({
  enrollToProAvailable: false,
  isPromoVisible: false,
  setIsPromoVisible: () => {},
});
EnrollToProContext.displayName = 'EnrollToProContext';

export const MODAL_ENROLL_TO_PRO_QUERY_KEY = 'show_enroll_to_pro';

export const EnrollToProProvider = ({ children }: { children: React.ReactNode }) => {
  const { isFeatureEnabled } = useAppContext();
  const { user } = useCurrentUser();
  const history = useHistory();

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const enrollToProAvailable = (
    isFeatureEnabled('usageConsumption')
    && user
    && user.billingAccount.subscription_type === BillingSubscriptionType.Free
  );

  const isPromoVisible = enrollToProAvailable && modalIsVisible;
  const setIsPromoVisible = React.useCallback((v: boolean) => {
    if (enrollToProAvailable) {
      setModalIsVisible(v);
    }
    const searchParams = new URLSearchParams(history.location.search);

    if (v) {
      searchParams.set(MODAL_ENROLL_TO_PRO_QUERY_KEY, 'true');
    } else {
      searchParams.delete(MODAL_ENROLL_TO_PRO_QUERY_KEY);
    }

    history.replace({
      search: searchParams.toString(),
    });
  }, [enrollToProAvailable]);

  const { search } = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const isVisible = searchParams.get(MODAL_ENROLL_TO_PRO_QUERY_KEY) === 'true';
    if (isVisible) {
      setIsPromoVisible(true);
    }
  }, [search]);

  return (
    <EnrollToProContext.Provider value={{
      enrollToProAvailable,
      isPromoVisible,
      setIsPromoVisible,
    }}
    >
      {children}
    </EnrollToProContext.Provider>
  );
};

export const useEnrollToPro = () => useContext(EnrollToProContext);
