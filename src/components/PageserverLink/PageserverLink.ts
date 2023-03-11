import { usePageserverCache } from '../../admin/utils/caches';
import { createInstanceLink } from '../InstanceLink/InstanceLink';

export const PageserverLink = createInstanceLink({
  cache: usePageserverCache,
});
