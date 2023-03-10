import '../styles/theme.light.scss';
import '../styles/basic.css';
import { AnalyticsAppNames } from '#shared/utils/analytics';
import { renderComponent } from '../renderer';
import { ConnectApp } from './pages/ConnectApp';
import { AnalyticsPageMapper } from './config/routes';

renderComponent(ConnectApp, {
  analyticsAppName: AnalyticsAppNames.PsqlConnect,
  analyticsPageMapper: AnalyticsPageMapper,
});
