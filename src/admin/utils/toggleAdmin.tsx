import { generatePath } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastError } from '../../components/Toast/Toast';
import { AdminRoutes } from '../config/routes';
import { api } from '../apiClient';
import { User } from '../../components/types';

export const toggleAdmin = (user: User, opts?: { onSuccess?: () => void; }) => api.put(
  generatePath(AdminRoutes.UsersItem, { userId: user.id.toString() }),
  { admin: !user.admin },
).then(() => {
  if (opts && opts.onSuccess) {
    opts.onSuccess();
  }
}).catch((err) => toast(<ToastError body={err.toString()} />));
