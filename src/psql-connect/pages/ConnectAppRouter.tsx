import { Switch } from 'react-router-dom';
import { TrackingRoute } from '../../utils/analytics';
import { LayoutCentered } from '../../components/Layout/LayoutCentered/LayoutCentered';
import { PsqlConnectRoutes } from '../config/routes';
import { Projects } from './Projects';
import { ProjectNew } from './ProjectNew';
import { Success } from './Success';
import { Error } from './Error';
import { Endpoints } from './Endpoints';

export const ConnectAppRouter = () => (
  <LayoutCentered
    logoLinkConfig={{ as: 'a', href: window.location.origin }}
  >
    <Switch>
      <TrackingRoute
        path={PsqlConnectRoutes.List}
        exact
        component={Projects}
      />
      <TrackingRoute
        path={PsqlConnectRoutes.Endpoints}
        exact
        component={Endpoints}
      />
      <TrackingRoute
        path={PsqlConnectRoutes.NewProject}
        exact
        component={ProjectNew}
      />
      <TrackingRoute
        path={PsqlConnectRoutes.Success}
        exact
        component={Success}
      />
      <TrackingRoute
        path={PsqlConnectRoutes.Error}
        exact
        component={Error}
      />
    </Switch>
  </LayoutCentered>
);
