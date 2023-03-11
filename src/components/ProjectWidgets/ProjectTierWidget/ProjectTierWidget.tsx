import React, { HTMLAttributes } from 'react';
import { WidgetBody } from '../../../components/Widget/WidgetBody';
import { WidgetTable } from '../../../components/Widget/WidgetTable';
import { Widget, WidgetProps } from '../../../components/Widget/Widget';
import { useCurrentUser } from '../../../hooks/currentUser';
import { useBranches } from '../../../hooks/projectBranches';
import { Loader } from '../../../components/Loader/Loader';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { humanizeActiveTime, humanizeCPUHours, humanReadableBytes } from '../../../utils/units';
import { PercentBar } from '../../../components/PercentBar/PercentBar';
import { DateTimeFormat, formatDate } from '../../../utils/formatDate';
import { Alert } from '../../../components/Alert/Alert';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import { EnrollToProConditional } from '../../../components/EnrollToPro/EnrollToPro';
import { WidgetLink } from '../../../components/Widget/WidgetLink';
import { BillingSubscriptionType } from '../../../api/generated/api_public_v2';
import { ProjectWidgetPlaceholder } from '../ProjectWidgetPlaceholder/ProjectWidgetPlaceholder';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';
import { useAppContext } from '../../../app/hooks/app';

import styles from './ProjectTierWidget.module.css';

const NoLimitsPlaceholder = () => (<>Unlimited</>);

export const ProjectTierWidget = (props: HTMLAttributes<HTMLDivElement>) => {
  const { isFeatureEnabled } = useAppContext();
  const { isLoading: isProjectLoading, project } = useProjectsItemContext();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const { branches, isLoading: isBranchesLoading } = useBranches();
  const { trackUiInteraction } = useAnalytics();

  const branchesLimitsNode = React.useMemo(() => {
    if (isUserLoading || isProjectLoading) {
      return null;
    }

    if (user.branchesLimit < 0) {
      return <NoLimitsPlaceholder />;
    }

    return (
      <>
        {
          isBranchesLoading
            ? <Loader />
            : branches.length
        }
        {' '}
        /
        {' '}
        {user.branchesLimit}
      </>
    );
  }, [user.branchesLimit, isBranchesLoading, branches, isProjectLoading, isUserLoading]);

  const CPUHoursLimitsNode = React.useMemo(() => {
    if (isUserLoading || isProjectLoading || !project) {
      return <Loader />;
    }

    const isCpuHoursLimited = user.computeSecondsLimit > 0;

    return (
      <div className={styles.cpuHours}>
        {isCpuHoursLimited
          && (
            <PercentBar
              percent={project.cpu_used_sec / user.computeSecondsLimit}
              hint="Percentage of CPU hours used."
            />
          )}
        {humanizeCPUHours(project.cpu_used_sec)}
        {isCpuHoursLimited
          && (
            <>
              {' '}
              /
              {' '}
              {humanizeCPUHours(user.computeSecondsLimit)}
            </>
          )}
      </div>
    );
  }, [user.computeSecondsLimit, isProjectLoading, isUserLoading, project]);

  const activeTimeLimitsNode = React.useMemo(() => {
    if (isUserLoading || isProjectLoading || !project) {
      return <Loader />;
    }

    const isCpuHoursLimited = user.computeSecondsLimit > 0;

    return (
      <div className={styles.cpuHours}>
        {isCpuHoursLimited
        && (
          <PercentBar
            percent={project.active_time / user.computeSecondsLimit}
            hint="Active time hours used."
          />
        )}
        {humanizeActiveTime(project.active_time)}
        {isCpuHoursLimited
        && (
          <>
            {' '}
            /
            {' '}
            {humanizeActiveTime(user.computeSecondsLimit)}
          </>
        )}
      </div>
    );
  }, [user.computeSecondsLimit, isProjectLoading, isUserLoading, project]);

  const widgetLinks = React.useMemo(() => {
    const links: WidgetProps['links'] = user.billingAccount.subscription_type === BillingSubscriptionType.Free ? [
      <EnrollToProConditional
        as={WidgetLink}
        onClick={() => trackUiInteraction(AnalyticsAction.ProjectTierWidgetUpgradeToProClicked)}
      >
        Manage limits
      </EnrollToProConditional>,
      {
        as: 'a',
        target: '_blank',
        href: 'https://cloudrock.ca/docs/introduction/technical-preview-free-tier/',
        children: 'Read more',
        onClick: () => trackUiInteraction(AnalyticsAction.ProjectTierWidgetReadMoreClicked),
      },
    ] : [];

    return links;
  }, [project, trackUiInteraction, user]);

  const resetsOnBadge = project && project.quota_reset_at
    ? (
      <Badge
        appearance="default"
        size="m"
      >
        Resets on
        {' '}
        {formatDate(project.quota_reset_at, DateTimeFormat.LimitsResetAtFormat)}
      </Badge>
    ) : null;

  if (isUserLoading || isProjectLoading) {
    return <ProjectWidgetPlaceholder />;
  }

  if (project?.owner_id !== user.id) {
    return null;
  }

  return (
    <Widget
      {...props}
      title="Usage"
      links={widgetLinks}
    >
      <WidgetBody>
        {(isFeatureEnabled('freeTierV2')
        && user.billingAccount.subscription_type === BillingSubscriptionType.Free)
          && (
          <Alert appearance="warning">
            Your free tier limits will change on
            {' '}
            <b>March 29, 2023</b>
            .
            {' '}
            <Button
              as="a"
              target="_blank"
              href="https://cloudrock.ca/docs/introduction/technical-preview-free-tier"
              appearance="default"
            >
              Read more
            </Button>
            .
          </Alert>
          )}
      </WidgetBody>
      <WidgetBody>
        <WidgetTable>
          <tr>
            <td>
              Branches
            </td>
            <td>
              <b>
                {branchesLimitsNode}
              </b>
            </td>
          </tr>
          {isFeatureEnabled('syntheticStorageSizeUI') && !!project && (
          <tr>
            <td>
              Used Storage
            </td>
            <td>
              <b>
                {project && project.synthetic_storage_size
                  ? humanReadableBytes(project.synthetic_storage_size)
                  : '-'}
              </b>
            </td>
          </tr>
          )}
          {user.billingAccount.subscription_type === BillingSubscriptionType.Pro
          && (
          <tr>
            <td>
              Compute time
              {resetsOnBadge}
            </td>
            <td>
              <b>
                {CPUHoursLimitsNode}
              </b>
            </td>
          </tr>
          )}
          {user.billingAccount.subscription_type === BillingSubscriptionType.Free
          && (
            <tr>
              <td>
                Active time
                {resetsOnBadge}
              </td>
              <td>
                <b>
                  {activeTimeLimitsNode}
                </b>
              </td>
            </tr>
          )}
        </WidgetTable>
      </WidgetBody>
    </Widget>
  );
};
