import '#shared/styles/basic.css';
import '#shared/styles/theme.light.scss';
import { AnalyticsAppNames } from '../utils/analytics';
import { renderComponent } from '../index';

import { App } from './pages/App/App';
import { ANALYTICS_PAGE_MAPPER } from './config/routes_mapper';

renderComponent(App, {
  analyticsAppName: AnalyticsAppNames.Console,
  analyticsPageMapper: ANALYTICS_PAGE_MAPPER,
});
