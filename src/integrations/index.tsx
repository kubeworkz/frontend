import '#shared/styles/theme.light.scss';
import '#shared/styles/basic.css';
import { AnalyticsAppNames } from '#shared/utils/analytics';
import { renderComponent } from '../renderer';
import { IntegrationsApp } from './components/IntegrationsApp/IntegrationsApp';

renderComponent(IntegrationsApp, {
  analyticsAppName: AnalyticsAppNames.Integrations,
});
