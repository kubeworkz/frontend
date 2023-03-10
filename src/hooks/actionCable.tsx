import React, {
  createContext, PropsWithChildren, useEffect, useRef,
} from 'react';
import { createConsumer, Subscription } from '@rails/actioncable';
import * as Sentry from '@sentry/react';

import { Endpoint, Project, Operation } from '#api_client/publicv2';
import { createUseContext } from './utils';

interface ActionCableContextInterface {
  subscribe: any;
  unsubscribe: any;
}

const ActionCableContext = createContext<ActionCableContextInterface | null>(null);
ActionCableContext.displayName = 'ActionCableContext';

const useActionCable = createUseContext(ActionCableContext);

const consumer = createConsumer();

const CHECK_SUBSCRIPTION_TIMEOUT = 3000;
const WS_MAX_CONNECTION_ATTEMPTS = 3;
const CALL_FALLBACK_TIMEOUT = 5000;

// /projects channel
export interface ProjectsChannelData
  extends Pick<Project, 'id' | 'updated_at'> {
  deleted: boolean;
}

// /operations channel
export interface OperationsChannelData extends Pick<Operation, 'status' | 'id' | 'updated_at'> {}

// /endpoints channel
export type EndpointChannelData = Pick<Endpoint, 'id' | 'updated_at' | 'current_state' | 'pending_state'> & {
  deleted: boolean;
};

export const getNewestData = (...data: Array<any & { updated_at: string }>) => data
  .sort((a, b) => +new Date(a.updated_at) - (+new Date(b.updated_at)))
  .reduce((acc, curr) => ({
    ...acc,
    ...curr,
  }), {});

const ActionCableProvider = ({ children }: PropsWithChildren<{}>) => {
  const disconnectTimeout = useRef<number>();

  const subscribe = (i: any, mixin = {}) => {
    clearTimeout(disconnectTimeout.current);
    return consumer.subscriptions.create(i, mixin);
  };

  // @ts-ignore
  const unsubscribe = (subscription) => {
    // @ts-ignore
    consumer.subscriptions.remove(subscription);
  };

  useEffect(() => () => {
    clearTimeout(disconnectTimeout.current);
  }, []);

  return (
    <ActionCableContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </ActionCableContext.Provider>
  );
};

export interface UseSubscriptionReturns {
  subscribe(onConnect?: Function): void;
  unsubscribe(): void;
}

export function useSubscription(chName: '/projects', receiver: (data: ProjectsChannelData) => void, fallback: () => void): UseSubscriptionReturns;
export function useSubscription(chName: '/operations', receiver: (data: OperationsChannelData) => void, fallback: () => void): UseSubscriptionReturns;
export function useSubscription(chName: '/endpoints', receiver: (data: EndpointChannelData) => void, fallback: () => void): UseSubscriptionReturns;
export function useSubscription(
  chName: string,
  receiver: (data: any) => void,
  fallback: () => void,
): UseSubscriptionReturns {
  const {
    subscribe: actionCableSubscribe,
    unsubscribe: actionCableUnsubscribe,
  } = useActionCable();

  const subscription = useRef<Subscription | undefined>();
  const checkSubscriptionTimeout = useRef<number>();
  const fallbackTimeout = useRef<number>();

  const startPollFallback = () => {
    fallback();
    fallbackTimeout.current = window.setInterval(() => {
      fallback();
    }, CALL_FALLBACK_TIMEOUT);
  };

  const unsubscribe = () => {
    if (subscription.current) {
      actionCableUnsubscribe(subscription.current);
    }
  };

  const checkSubscription = () => {
    const connection = subscription.current?.consumer.connection;
    if (!connection) {
      return;
    }
    if (connection.disconnected
      && connection.monitor.reconnectAttempts >= WS_MAX_CONNECTION_ATTEMPTS
    ) {
      Sentry.captureMessage('Couldn\'t establish ActionCable connection');
      unsubscribe();
      startPollFallback();
    } else if (connection.disconnected) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      scheduleCheckSubscription();
    }
  };

  const scheduleCheckSubscription = () => {
    clearInterval(checkSubscriptionTimeout.current);
    checkSubscriptionTimeout.current = window.setTimeout(
      checkSubscription,
      CHECK_SUBSCRIPTION_TIMEOUT,
    );
  };

  const subscribe = (fn?: Function) => {
    setTimeout(() => {
      subscription.current = actionCableSubscribe(chName, {
        connected: fn,
        received: receiver,
      });

      scheduleCheckSubscription();
    }, 1);
  };

  React.useEffect(() => () => {
    clearTimeout(checkSubscriptionTimeout.current);
    clearInterval(fallbackTimeout.current);
  }, []);

  return { subscribe, unsubscribe };
}

export { ActionCableProvider, useActionCable };
