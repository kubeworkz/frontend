import React, { PropsWithChildren } from 'react';
import { Tippy } from '#shared/components/Tippy/Tippy';
import { Loader } from '#shared/components/Loader/Loader';
import { CacheDataId, CreateCacheReturn } from '../../utils/caches';
import { ObjectPreview } from '../ObjectPreview/ObjectPreview';
import styles from './InstanceLink.module.css';

export function createInstanceLink<T extends CacheDataId, D extends { id: T } >({
  cache,
  PreviewComponent = ObjectPreview,
}: {
  cache: CreateCacheReturn<T, D>['useCache'],
  PreviewComponent?: React.ComponentType<{ data: D }>
}) {
  const InstanceLink = ({ id, children }: PropsWithChildren<{ id: T }>) => {
    const { data, get } = cache(id);

    return (
      <Tippy
        className={styles.tippy}
        content={data && data.data ? <PreviewComponent data={data.data} /> : <Loader />}
        interactive
        placement="bottom"
      >
        <span
          onMouseEnter={data ? undefined : get}
        >
          {children}
        </span>
      </Tippy>
    );
  };
  InstanceLink.displayName = `${PreviewComponent.displayName}Link`;
  return InstanceLink;
}
