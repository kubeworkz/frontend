import '#shared/styles/theme.light.scss';
import '#shared/styles/basic.css';
import { AnalyticsAppNames } from '../utils/analytics';
import { renderComponent } from '../index';
import { Error } from './Error';

renderComponent(Error, { analyticsAppName: AnalyticsAppNames.Error });
