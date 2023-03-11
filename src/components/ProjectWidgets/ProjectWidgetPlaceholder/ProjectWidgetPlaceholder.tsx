import React, { HTMLAttributes } from 'react';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { WidgetBody } from '../../../components/Widget/WidgetBody';
import { Widget } from '../../../components/Widget/Widget';

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
