/* eslint-disable no-console */

import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import { AnalyticsAppNames, AnalyticsProvider } from './utils/analytics';
import { HubspotProvider } from './utils/hubspot';
import { Error as ErrorLayout } from './error/Error';

interface AppProps {
  userId?: string;
  [key: string]: any;
}

interface RenderComponentOptions {
  domNodeId: string;
  analyticsEnabled: boolean;
  analyticsAppName: string;
  analyticsPageMapper: { [key: string]: string };
}

const DEFAULT_OPTS: RenderComponentOptions = {
  domNodeId: 'root',
  analyticsEnabled: true,
  analyticsAppName: AnalyticsAppNames.Unknown,
  analyticsPageMapper: {},
};

export const renderComponent = (
  Component: any,
  opts: Partial<RenderComponentOptions> = {},
  initialProps: object = {},
) => {
  const options = {
    ...DEFAULT_OPTS,
    ...opts,
  };

  const propsFromServer = window.document.getElementById('react_props');
  const domNode = window.document.getElementById(options.domNodeId);

  if (!domNode) {
    throw new Error('Parent node not found');
  }

  let props: AppProps = initialProps;

  if (propsFromServer) {
    try {
      props = {
        ...props,
        ...window.JSON.parse(propsFromServer.innerText),
      };
    } catch (e) {
      console.warn('Wrong props');
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('Render component with props', props, options);
  }
  if (props.sentry) {
    Sentry.init({
      dsn: props.sentry.dsn,
      integrations: [new Integrations.BrowserTracing()],
      release: process.env.SENTRY_RELEASE,
      tracesSampleRate: parseFloat(props.sentry.sampleRate || '1.0'),
      environment: props.sentry.environment,
    });
  }

  ReactDOM.render(
    <React.StrictMode>
      <Sentry.ErrorBoundary fallback={() => (
        <ErrorLayout />
      )}
      >
        <HubspotProvider>
          <AnalyticsProvider
            userId={props.userId}
            enabled={options.analyticsEnabled}
            section={options.analyticsAppName}
            pageMapper={options.analyticsPageMapper}
            segmentKey={props.segmentKey}
          >
            <Component
              {...props}
            />
          </AnalyticsProvider>
        </HubspotProvider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>,
    domNode,
  );
};
