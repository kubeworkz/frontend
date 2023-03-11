import '../../styles/theme.light.scss';
import '../../styles/basic.css';
import { AnalyticsAppNames } from '../../utils/analytics';
import { renderComponent } from '../../index';
import { ConsentApp } from '../../components/ConsentApp/ConsentApp';

renderComponent(ConsentApp, { analyticsAppName: AnalyticsAppNames.OauthConsent });
