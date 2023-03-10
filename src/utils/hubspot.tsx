import React, { PropsWithChildren } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useCurrentUserInfoSafe } from '../hooks/currentUser';
import * as Sentry from '@sentry/react';

interface HubspotProviderProps {
}

export interface FeedbackFormData {
  email: string;
  message: string;
}

export interface SupportFormData {
  email: string;
  subject: string;
  content: string;
}

export const HUBSPOT_ERROR_TOAST_OPTIONS = {
  autoClose: 30000,
};

interface HubspotInterface {
  submitFeedbackForm(data: FeedbackFormData): Promise<any>;
  submitSupportForm(data: SupportFormData): Promise<any>;
}

const HubspotContext = React.createContext<HubspotInterface>({
  // eslint-disable-next-line prefer-promise-reject-errors
  submitSupportForm: () => Promise.reject('hubspot is not supported'),
  // eslint-disable-next-line prefer-promise-reject-errors
  submitFeedbackForm: () => Promise.reject('hubspot is not supported'),
});

export const useHubspot = () => (React.useContext(HubspotContext));

export const HubspotProvider = React.memo(({
  children,
}: PropsWithChildren<HubspotProviderProps>) => {
  const client = React.useMemo(() => axios.create({
    baseURL: 'https://api.hsforms.com/submissions/v3/integration/submit',
  }), []);
  const { id: userId } = useCurrentUserInfoSafe();

  const prepareFormData = React.useCallback((data: object) => ({
    submittedAt: +new Date(),
    fields: [
      ...Object.entries(data).map(([name, value]) => ({
        name,
        value,
      })),
      {
        name: 'user_id',
        value: userId,
      },
      {
        name: 'TICKET.user_agent',
        value: window.navigator.userAgent,
      },
    ],
    context: {
      hutk: Cookies.get('hutk'),
      pageUri: window.location.href,
      pageName: window.document.title,
    },
  }), []);

  const submitFeedbackForm = (data: FeedbackFormData) => client.post(
    '/26233105/5f7099bd-0cbc-4581-8684-2996f8cf174f',
    prepareFormData({
      email: data.email,
      'TICKET.content': data.message,
      'TICKET.subject': data.message.length > 140 ? `${data.message.substring(0, 140)}...` : data.message,
    }),
  ).catch((err) => {
    Sentry.captureMessage(`Failed to send feedback, err: ${err.toString()}`);
    throw err;
  });

  const submitSupportForm = (data: SupportFormData) => client.post(
    '/26233105/a1fb5612-969a-4f04-8b92-5c3b2422e326',
    prepareFormData({
      email: data.email,
      'TICKET.content': data.content,
      'TICKET.subject': data.subject,
    }),
  ).catch((err) => {
    Sentry.captureMessage(`Failed to send support form, err: ${err.toString()}`);
    throw err;
  });

  return (
    <HubspotContext.Provider
      value={{
        submitFeedbackForm,
        submitSupportForm,
      }}
    >
      {children}
    </HubspotContext.Provider>
  );
});
HubspotProvider.displayName = 'AnalyticsProvider';
