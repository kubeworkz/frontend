import '#shared/styles/theme.light.scss';
import '#shared/styles/basic.css';
import { AnalyticsAppNames } from '#shared/utils/analytics';
import { renderComponent } from '../renderer';
import { Error } from './Error';

renderComponent(Error, { analyticsAppName: AnalyticsAppNames.Error });
