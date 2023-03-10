import '../styles/theme.light.scss';
import '../styles/basic.css';
import { renderComponent } from '../index';
import { AdminApp } from '../components/AdminApp/AdminApp';

renderComponent(AdminApp, {
  analyticsEnabled: false,
});
