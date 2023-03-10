/* eslint-disable react/no-array-index-key,jsx-a11y/click-events-have-key-events */
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Button } from '#shared/components/Button/Button';
import { onboardingDone, saveStep } from '#shared/utils/newProjectOnboarding';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import styles from './Onboarding.module.css';

export type OnboardingContent = Array<[string, React.ReactNode]>;

interface OnboardingProps extends HTMLAttributes<HTMLDivElement> {
  onDone(): void;
  content: OnboardingContent;
}

export const Onboarding = ({ className, content, onDone }: OnboardingProps) => {
  const { trackUiInteraction } = useAnalytics();
  const [currentStep, setCurrentStep] = React.useState(0);

  const closeOnboarding = React.useCallback(() => {
    onboardingDone();
    onDone();
  }, [onDone]);

  const setStep = React.useCallback((step: number) => {
    setCurrentStep(step);
    saveStep(step);
  }, []);

  const onSkipClick = React.useCallback(() => {
    trackUiInteraction(AnalyticsAction.OnboardingSkipped);
    closeOnboarding();
  }, [closeOnboarding]);

  const onNextClick = React.useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep < content.length) {
      trackUiInteraction(AnalyticsAction.OnboardingNextStepClicked);
      setStep(nextStep);
    } else {
      trackUiInteraction(AnalyticsAction.OnboardingDone);
      closeOnboarding();
    }
  }, [currentStep, content, closeOnboarding]);

  const onStepClick = React.useCallback((step: number) => {
    trackUiInteraction(AnalyticsAction.OnboardingStepClicked);
    setStep(step);
  }, [closeOnboarding]);

  const currentStepContent: React.ReactNode | React.ComponentType = React.useMemo(
    () => content[currentStep][1],
    [currentStep],
  );

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.container}>
        <ol className={styles.features}>
          {content.map((item, index) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={index}
              className={classNames(styles.feature, {
                [`${styles.feature_active}`]: index === currentStep,
              })}
              onClick={() => onStepClick(index)}
            >
              {item[0]}
            </li>
          ))}
        </ol>
        <div className={styles.content}>
          <div className={styles.title}>
            Neon onboarding
          </div>
          <div className={styles.description}>
            {currentStepContent}
          </div>
          <div className={styles.actions}>
            <Button
              className={styles.btn}
              onClick={onNextClick}
              size="l"
            >
              {currentStep === content.length - 1 ? 'Got it!' : 'Next'}
            </Button>
            <Button
              appearance="default"
              className={styles.btn}
              onClick={onSkipClick}
              size="l"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
