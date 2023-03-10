import '../styles/theme.light.scss';
import '../styles/basic.css';
import { AnalyticsAppNames } from '../utils/analytics';
import { renderComponent } from '../index';
import SignIn from '../components/SignIn/SignIn';
import { ANALYTICS_PAGE_MAPPER } from './config';

renderComponent(SignIn, {
  analyticsAppName: AnalyticsAppNames.Auth,
  analyticsPageMapper: ANALYTICS_PAGE_MAPPER,
});
