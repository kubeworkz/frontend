import { useSafekeeperCache } from '../../utils/caches';
import { createInstanceLink } from '../InstanceLink/InstanceLink';

export const SafekeeperLink = createInstanceLink({
  cache: useSafekeeperCache,
});
