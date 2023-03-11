import React, { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import { Text } from '../../components/Text/Text';
import { AdminOperation } from '../../api/generated/api';
import { GrafanaConfig } from '../AdminApp/types';

interface GrafanaLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
}

const getGrafanaEnvironmentSearchString = (consoleEnv: string) => {
  if (consoleEnv === 'production') {
    return `var-environment=${consoleEnv}&var-datasource=grafanacloud-cloudrockprod-logs`;
  } if (consoleEnv === 'staging') {
    return `var-environment=${consoleEnv}&var-datasource=grafanacloud-cloudrockstaging-logs`;
  }

  return '';
};

export const createPageserverInstanceLogsUrl = (config: GrafanaConfig, address: string = '') => (`${config.url}/d/${config.pageserverDashboardUid}?var-instance=${address}`);
export const createSafekeeperInstanceLogsUrl = (config: GrafanaConfig, address: string = '') => (`${config.url}/d/${config.safekeeperDashboardUid}?var-instance=${address}`);
export const createTimelineLogsUrl = (config: GrafanaConfig, search: string) => (`${config.url}/d/${config.timelineDashboardUid}?var-timeline=${search}`);
export const createConsoleLogsUrl = (config: GrafanaConfig, consoleEnv: string, search: string) => (`${config.url}/d/${config.consoleDashboardUid}?var-search=${search}&${getGrafanaEnvironmentSearchString(consoleEnv)}`);
export const createOpsLogsUrl = (config: GrafanaConfig, consoleEnv: string, op: AdminOperation) => {
  const updatedAt = dayjs(op.updated_at);

  const from = updatedAt.subtract(5, 'minute').format('x');
  const to = updatedAt.add(5, 'minute').format('x');

  return (`${config.url}/d/${config.consoleDashboardUid}?var-search=${op.id}&from=${from}&to=${to}&${getGrafanaEnvironmentSearchString(consoleEnv)}`);
};
export const createTimelineInspectorUrl = (config: GrafanaConfig, consoleEnv: string, timelineId: string) => (`${config.url}/d/${config.consoleDashboardUid}?var-timeline_id=${timelineId}&${getGrafanaEnvironmentSearchString(consoleEnv)}`);

export const GrafanaLink = (props: PropsWithChildren<GrafanaLinkProps>) => (
  <Text
    as="a"
    {...props}
    target="_blank"
  >
    {props.children}
  </Text>
);
