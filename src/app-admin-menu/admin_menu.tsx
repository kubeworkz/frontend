import ReactDOM from 'react-dom';
import { AdminMenu } from '../components/AdminMenu/AdminMenu';
import styles from './components/AdminMenu/AdminMenu.module.css';

const node = window.document.createElement('div');
node.className = styles.container;

window.document.body.append(node);
const propsFromServer = window.document.getElementById('react_props');
const props = JSON.parse(propsFromServer?.innerHTML ?? '{}');

ReactDOM.render(
  <AdminMenu {...props} />,
  node,
);
