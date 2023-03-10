import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { IntegrationsRoutes } from '#shared/routes';
import { Error } from '#shared/components/Error/Error';

import { Vercel } from '../Vercel/Vercel';
import { IntegrationsProps } from '../../types';
import styles from './IntegrationsRouter.module.css';

export const IntegrationsRouter = (props: IntegrationsProps) => (props.error ? (
  <div className={styles.root}>
    <Error title="Integration failed" subtitle={props.error} />
  </div>
) : (
  <Switch>
    <Route path={IntegrationsRoutes.Vercel} exact render={() => <Vercel {...props} />} />
  </Switch>
));
