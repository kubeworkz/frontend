import { Platform } from '../hooks/platforms';

export function isServerless(platformOrPlatformId: Platform | Platform['id']) {
  // XXX: temporary hack
  return typeof platformOrPlatformId === 'string' ? platformOrPlatformId === 'aws' : platformOrPlatformId.id === 'aws';
}
