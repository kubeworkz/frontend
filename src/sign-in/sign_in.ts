import '#shared/styles/theme.light.scss';
import '#shared/styles/basic.css';
import { AnalyticsAppNames } from '#shared/utils/analytics';
import { renderComponent } from '../renderer';
import SignIn from './components/SignIn/SignIn';
import { ANALYTICS_PAGE_MAPPER } from './config';

renderComponent(SignIn, {
  analyticsAppName: AnalyticsAppNames.Auth,
  analyticsPageMapper: ANALYTICS_PAGE_MAPPER,
});
