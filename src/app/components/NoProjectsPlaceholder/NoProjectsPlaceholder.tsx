import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';

import { BigCarousel } from '#shared/components/BigCarousel/BigCarousel';
import { ProgressBadge } from '#shared/components/ProgressBadge/ProgressBadge';

import { AnyLink } from '#shared/components/AnyLink/AnyLink';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { ProjectFormModal } from '../ProjectFormModal/ProjectFormModal';

import styles from './NoProjectsPlaceholder.module.css';

const SLIDES = ['slide-welcome', 'slide-branching', 'slide-sql'] as const;
type SlideId = typeof SLIDES[number];

export const NoProjectsPlaceholder = () => {
  const [activeSlide, setActiveSlide] = React.useState<SlideId>(SLIDES[0]);
  const { trackUiInteraction } = useAnalytics();

  const onToSlideOne = useCallback(() => {
    trackUiInteraction(AnalyticsAction.NoProjectsSlideOneClicked);
    setActiveSlide(SLIDES[0]);
  }, []);
  const onToSlideTwo = useCallback(() => {
    trackUiInteraction(AnalyticsAction.NoProjectsSlideTwoClicked);
    setActiveSlide(SLIDES[1]);
  }, []);
  const onToSlideThree = useCallback(() => {
    trackUiInteraction(AnalyticsAction.NoProjectsSlideThreeClicked);
    setActiveSlide(SLIDES[2]);
  }, []);

  useEffect(() => {
    trackUiInteraction(AnalyticsAction.NoProjectsShown);
  }, []);

  const [createProjectVisible, setCreateProjectVisible] = React.useState(false);

  const onCreateProjectClick = useCallback(() => {
    trackUiInteraction(AnalyticsAction.NoProjectsCreateProjectClicked);
    setCreateProjectVisible(true);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.badges}>
          <ProgressBadge
            className={classNames(styles.badge, styles.bgColorWelcome)}
            active={activeSlide === SLIDES[0]}
            onClick={onToSlideOne}
          >
            WELCOME
          </ProgressBadge>
          <ProgressBadge
            className={classNames(styles.badge, styles.bgColorBranching)}
            active={activeSlide === SLIDES[1]}
            onClick={onToSlideTwo}
          >
            BRANCHING
          </ProgressBadge>
          <ProgressBadge
            className={classNames(styles.badge, styles.bgColorSqlEditor)}
            active={activeSlide === SLIDES[2]}
            onClick={onToSlideThree}
          >
            SQL EDITOR
          </ProgressBadge>
        </div>
        <BigCarousel activeSlideId={activeSlide}>
          <BigCarousel.Item
            className={classNames(styles.slide, styles.bgColorWelcome)}
            id={SLIDES[0]}
          >
            <div
              className={classNames(styles.slideContent, styles.slideWelcome, {
                [styles.slideActive]: activeSlide === SLIDES[0],
              })}
            >
              <h1 className={styles.slideTitle}>
                Set up serverless Postgres in seconds
              </h1>
              <div className={styles.slideDescription}>
                <ul className={styles.slideList}>
                  <li>
                    <span className={styles.slideListContent}>
                      Get a free project with up to 10 branches in our free tier
                    </span>
                  </li>
                  <li>
                    <span className={styles.slideListContent}>
                      Use up to
                      {' '}
                      <strong>3 GB</strong>
                      {' '}
                      of storage in each branch
                    </span>
                  </li>
                  <li>
                    <span className={styles.slideListContent}>
                      <b>100</b>
                      {' '}
                      compute hours per month
                    </span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                className={styles.slideButton}
                onClick={onToSlideTwo}
              >
                Next: Branching
              </button>
            </div>
          </BigCarousel.Item>
          <BigCarousel.Item
            className={classNames(styles.slide, styles.bgColorBranching)}
            id={SLIDES[1]}
          >
            <div
              className={classNames(styles.slideContent, styles.slideBranching, {
                [styles.slideActive]: activeSlide === SLIDES[1],
              })}
            >
              <h1 className={styles.slideTitle}>
                Instant branching for Postgres
              </h1>
              <div className={styles.slideDescription}>
                Spin up a branch for each
                {' '}
                <strong>
                  environment, developer, feature, test, or pull request.
                </strong>
              </div>
              <button
                type="button"
                className={styles.slideButton}
                onClick={onToSlideThree}
              >
                Next: SQL Editor
              </button>
            </div>
          </BigCarousel.Item>
          <BigCarousel.Item
            className={classNames(styles.slide, styles.bgColorSqlEditor)}
            id={SLIDES[2]}
          >
            <div
              className={classNames(styles.slideContent, styles.slideSqlEditor, {
                [styles.slideActive]: activeSlide === SLIDES[2],
              })}
            >
              <h1 className={styles.slideTitle}>Explore data in your browser</h1>
              <div className={styles.slideDescription}>
                View tables, run SQL queries, and access database branches from
                your browser.
              </div>
              <button
                type="button"
                className={styles.slideButton}
                onClick={onCreateProjectClick}
              >
                Create your first project
              </button>
            </div>
          </BigCarousel.Item>
        </BigCarousel>
        <div className={styles.skipOnboarding}>
          Ready to get started?
          {' '}
          <AnyLink
            as="button"
            className={styles.createProjectLink}
            data-qa="project_create_button"
            onClick={onCreateProjectClick}
          >
            Create a project
          </AnyLink>
        </div>
        <ProjectFormModal
          isOpen={createProjectVisible}
          onRequestClose={() => setCreateProjectVisible(false)}
        />
      </div>
    </div>
  );
};
