import React, {
  createContext, PropsWithChildren,
} from 'react';
import { createUseContext } from '../hooks/utils';

export interface Region {
  id: string;
  name: string;
  platform_id: number;
  default: boolean;
  active: boolean;
  supported_provisioners: Array<string>
}

export interface InstanceType {
  id: string;
  group: string;
  platform_id: number;
  memory_size: number;
  vcpu_count: number;
  default: boolean;
}

export interface Platform {
  id: string;
  name: string;
  regions: Region[];
  instance_types: InstanceType[];
  default: boolean;
}

interface PlatformsContextInterface {
  platforms: Platform[];
  platformsById: Record<Platform['id'], Platform>;
  regionsByPlatform: Record<Platform['id'], Region[]>;
  instanceTypesByPlatform: Record<Platform['id'], InstanceType[]>;
  regionsById: Record<Platform['id'], Record<Region['id'], Region>>;
  getRegion(platformId: Platform['id'], regionId: Region['id']): Region | undefined;
  getRegionSafe(platformId: Platform['id'], regionId: Region['id']): Region | undefined;
}

export interface ConsoleUser {
  login: string;
  projects_limit: number;
}

export interface PlatformsProviderProps {
  platforms: Platform[];
}

const PlatformsContext = createContext<PlatformsContextInterface | null>(null);
PlatformsContext.displayName = 'PlatformsContext';

const usePlatforms = createUseContext(PlatformsContext);

const PlatformsProvider = ({
  children,
  platforms: initialPlatforms,
}: PropsWithChildren<PlatformsProviderProps>) => {
  const platformsData: Omit<PlatformsContextInterface, 'getRegion' | 'getRegionSafe'> = React.useMemo(() => {
    const platforms = initialPlatforms
      .filter((p) => !!p.instance_types.length && !!p.regions.length)
      .sort((p) => (p.default ? -1 : 0));

    const regionsByPlatform: Record<Platform['id'], Region[]> = {};
    const instanceTypesByPlatform: Record<Platform['id'], InstanceType[]> = {};
    const platformsById: Record<Platform['id'], Platform> = {};
    const regionsById: Record<Platform['id'], Record<Region['id'], Region>> = {};

    platforms.forEach((platform) => {
      regionsByPlatform[platform.id] = platform.regions;
      regionsById[platform.id] = Object.fromEntries(platform.regions.map((r) => ([r.id, r])));
      instanceTypesByPlatform[platform.id] = platform.instance_types
        .sort((a, b) => (
          (a.vcpu_count - b.vcpu_count)
          || (a.memory_size - b.memory_size)
        ));
      platformsById[platform.id] = platform;
    });

    return {
      platforms,
      platformsById,
      regionsByPlatform,
      instanceTypesByPlatform,
      regionsById,
    };
  }, [initialPlatforms]);

  const getRegion: PlatformsContextInterface['getRegion'] = React.useCallback(
    (platformId: Platform['id'], regionId: Region['id']) => {
      if (!platformsData.regionsById[platformId]
        || !platformsData.regionsById[platformId][regionId]) {
        throw new Error(`No such region ${regionId} for platform ${platformId}`);
        return undefined;
      }

      return platformsData.regionsById[platformId][regionId];
    },
    [platformsData],
  );

  const getRegionSafe: PlatformsContextInterface['getRegionSafe'] = React.useCallback(
    (platformId: Platform['id'], regionId: Region['id']) => {
      try {
        return getRegion(platformId, regionId);
      } catch {
        return undefined;
      }
    }, [getRegion],
  );

  return (
    <PlatformsContext.Provider
      value={{
        ...platformsData,
        getRegion,
        getRegionSafe,
      }}
    >
      {children}
    </PlatformsContext.Provider>
  );
};

export { PlatformsProvider, usePlatforms };
