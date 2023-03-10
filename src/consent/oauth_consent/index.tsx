import '#shared/styles/theme.light.scss';
import '#shared/styles/basic.css';
import { AnalyticsAppNames } from '#shared/utils/analytics';
import { renderComponent } from '../renderer';
import { ConsentApp } from './components/ConsentApp/ConsentApp';

renderComponent(ConsentApp, { analyticsAppName: AnalyticsAppNames.OauthConsent });
