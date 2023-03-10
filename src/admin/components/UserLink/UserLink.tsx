import { useUserCache } from '../../utils/caches';
import { UserPreview } from '../UserPreview/UserPreview';
import { createInstanceLink } from '../InstanceLink/InstanceLink';

export const UserLink = createInstanceLink({
  cache: useUserCache,
  PreviewComponent: UserPreview,
});
