import store from 'store2';
import { StoreKeys } from '../config/config';

export const forceShowOnboarding = () => store.remove(StoreKeys.NewProjectOnboardingDone);

export const saveStep = (step: number) => store.set(StoreKeys.NewProjectOnboardingStep, step);

export const onboardingDone = () => store.set(StoreKeys.NewProjectOnboardingDone, true);

export const isOnboardingDone = () => !!store.get(StoreKeys.NewProjectOnboardingDone);
