import React, { HTMLAttributes } from 'react';
import { Skeleton } from '#shared/components/Skeleton/Skeleton';
import { WidgetBody } from '#shared/components/Widget/WidgetBody';
import { Widget } from '#shared/components/Widget/Widget';

export const ProjectWidgetPlaceholder = (props: HTMLAttributes<HTMLDivElement>) => (
  <Widget
    className={props.className}
    title={<Skeleton style={{ width: '240px', height: '12px' }} />}
  >
    <WidgetBody>
      <div style={{ display: 'flex', gap: '22px', marginBottom: '40px' }}>
        <Skeleton style={{ flexGrow: 1, height: '44px' }} />
        <Skeleton style={{ flexGrow: 1, height: '44px' }} />
      </div>
      <Skeleton style={{ height: '44px', marginBottom: '40px' }} />
      <Skeleton style={{ height: '44px' }} />
    </WidgetBody>
  </Widget>
);
