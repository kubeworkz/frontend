import '../styles/theme.light.scss';
import '../styles/basic.css';
import { AnalyticsAppNames } from '../utils/analytics';
import { renderComponent } from '../index';
import { IntegrationsApp } from '../components/IntegrationsApp/IntegrationsApp';

renderComponent(IntegrationsApp, {
  analyticsAppName: AnalyticsAppNames.Integrations,
});
