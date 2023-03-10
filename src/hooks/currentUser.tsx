import React, { createContext, PropsWithChildren, useContext } from 'react';
import { logout as serverLogout } from '../api/utils';
import { apiService, BillingAccount, BillingSubscriptionType } from '../api/publicv2';
import { navigateToLoginPage } from '../utils/navigateToLoginPage';

interface UserData {
  id: string;
  login: string;
  projectsLimit: number;
  branchesLimit: number;
  maxAutoscalingLimit: number;
  computeSecondsLimit: number;
  name: string;
  image: string;
  email: string;
  billingAccount: BillingAccount;
}

interface UserContextInterface {
  isAuthorized: boolean,
  isLoading: boolean;
  logout(): void;
  fetch(): void;
  user: UserData;
}

export const UserContext = createContext<UserContextInterface>({
  isAuthorized: false,
  isLoading: false,
  logout: () => {},
  fetch: () => {},
  user: {
    id: '',
    login: '',
    projectsLimit: 0,
    branchesLimit: 0,
    maxAutoscalingLimit: 0,
    computeSecondsLimit: 0,
    name: '',
    image: '',
    email: '',
    billingAccount: {
      subscription_type: BillingSubscriptionType.UNKNOWN,
    } as any,
  },
});
UserContext.displayName = 'UserContext';

const useCurrentUser = () => useContext(UserContext);

export const useCurrentUserInfoSafe = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    return {
      id: '',
      name: '',
      email: '',
      isLoading: false,
    };
  }

  return {
    id: context.user.id,
    name: context.user.name,
    email: context.user.email,
    isLoading: context.isLoading,
  };
};

const EMPTY_USER_DATA = {
  projectsLimit: -1,
  branchesLimit: -1,
  branchLogicalSizeLimit: -1,
  maxAutoscalingLimit: 1,
  computeSecondsLimit: -1,
  subscriptionType: BillingSubscriptionType.UNKNOWN,
  id: '',
  login: '',
  name: '',
  email: '',
  image: '',
};

const CurrentUserProvider = ({
  children,
  initialSubscriptionType = BillingSubscriptionType.UNKNOWN,
}: PropsWithChildren<{
  initialSubscriptionType?: BillingSubscriptionType
}>) => {
  const [state, setState] = React.useState<UserData>({
    ...EMPTY_USER_DATA,
    billingAccount: {
      subscription_type: initialSubscriptionType,
    } as any,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  const logout = React.useCallback(() => {
    serverLogout()
      .then(navigateToLoginPage);
  }, []);

  const fetch = React.useCallback(() => apiService.getCurrentUserInfo()
    .then(({ data }) => {
      setState({
        id: data.id,
        login: data.login,
        name: data.name,
        email: data.email,
        image: data.image,
        projectsLimit: data.projects_limit,
        branchesLimit: data.branches_limit,
        maxAutoscalingLimit: data.max_autoscaling_limit,
        computeSecondsLimit: data.compute_seconds_limit,
        billingAccount: data.billing_account,
      });
    }), []);

  React.useEffect(() => {
    setIsLoading(true);
    fetch().finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{
      isAuthorized: true,
      logout,
      fetch,
      user: state,
      isLoading,
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { CurrentUserProvider, useCurrentUser };
