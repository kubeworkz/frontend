import { ReactNode, useMemo } from 'react';
import { useCurrentUser } from '../../hooks/currentUser';
import { useBranches } from '../../hooks/projectBranches';

import { useProjectEndpoints } from './projectEndpoints';

interface UserLimitsData {
  limit: number | never;
  currentCount: number | never;
  leftCount?: number | never;
  message?: ReactNode | never;
  isLimitExceeded: boolean | never;
  isLoading: boolean;
}

interface UserLimitsDataLoading extends UserLimitsData {
  isLoading: true;
  limit: never;
  currentCount: never;
  leftCount?: never;
  message?: never;
  isLimitExceeded: never;
}

interface UserLimitsDataReady extends UserLimitsData {
  isLoading: false;
  limit: number;
  currentCount: number;
  leftCount?: number;
  message?: ReactNode;
  isLimitExceeded: boolean;
}

type UseUserLimitsReturn = UserLimitsDataLoading | UserLimitsDataReady;

const isUnlimited: (limit: number) => boolean = (limit) => limit < 0;

export const getLimitsLabel = (limitsData: UseUserLimitsReturn) => {
  if (limitsData.isLoading || isUnlimited(limitsData.limit)) {
    return '';
  }

  return `${limitsData.currentCount}/${limitsData.limit}`;
};

export const useUserBranchesLimit = () => {
  const {
    user: { branchesLimit },
    isLoading: isUserLoading,
  } = useCurrentUser();
  const { isLoading: isBranchesLoading, branchesCount } = useBranches();

  const isLoading = useMemo(
    () => isUserLoading || isBranchesLoading,
    [isUserLoading, isBranchesLoading],
  );

  const result: Omit<UserLimitsData, 'isLoading'> = useMemo(() => {
    if (isLoading) {
      return {} as Omit<UserLimitsDataLoading, 'isLoading'>;
    }

    if (isUnlimited(branchesLimit)) {
      return {
        limit: -1,
        currentCount: branchesCount,
        isLimitExceeded: false,
      };
    }

    const isLimitExceeded = branchesCount >= branchesLimit;
    const diff = branchesLimit - branchesCount;

    return {
      limit: branchesLimit,
      currentCount: branchesCount,
      leftCount: isLimitExceeded ? 0 : diff,
      message: isLimitExceeded
        ? 'You have reached your branch limit for this project. Remove existing branches if you want to create more.'
        : `You can create ${diff} more branch${diff > 1 ? 'es' : ''}`,
      isLimitExceeded,
    };
  }, [isLoading, branchesCount, branchesLimit]);

  return {
    isLoading,
    ...result,
  } as UseUserLimitsReturn;
};

export const useUserEndpointsLimit = () => {
  const {
    isLoading: isUserLoading,
  } = useCurrentUser();
  const limit = -1;
  const { isLoading: isEndpointsLoading, endpointsCount } = useProjectEndpoints();

  const isLoading = useMemo(
    () => isUserLoading || isEndpointsLoading,
    [isUserLoading, isEndpointsLoading],
  );

  const result: Omit<UserLimitsData, 'isLoading'> = useMemo(() => {
    if (isLoading) {
      return {} as Omit<UserLimitsDataLoading, 'isLoading'>;
    }

    if (isUnlimited(limit)) {
      return {
        limit: -1,
        currentCount: endpointsCount,
        isLimitExceeded: false,
      };
    }

    const isLimitExceeded = endpointsCount >= limit;
    const diff = limit - endpointsCount;

    return {
      limit,
      currentCount: endpointsCount,
      leftCount: isLimitExceeded ? 0 : diff,
      message: isLimitExceeded
        ? 'You have reached the project limit for compute endpoints. Remove existing compute endpoints if you want to create more.'
        : `You can create ${diff} more compute endpoint${diff > 1 ? 's' : ''}`,
      isLimitExceeded,
    };
  }, [isLoading, endpointsCount, limit]);

  return {
    isLoading,
    ...result,
  } as UseUserLimitsReturn;
};
