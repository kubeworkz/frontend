import React, { HTMLAttributes } from 'react';
import { Widget } from '#shared/components/Widget/Widget';
import { WidgetBody } from '#shared/components/Widget/WidgetBody';
import { WidgetTable } from '#shared/components/Widget/WidgetTable';
import { usePlatforms } from '#shared/hooks/platforms';
import { useProjectsItemContext } from '../../../hooks/projectsItem';
import { ProjectWidgetPlaceholder } from '../ProjectWidgetPlaceholder/ProjectWidgetPlaceholder';

import styles from './ProjectComputeWidget.module.css';

export const ProjectComputeWidget = (props: HTMLAttributes<HTMLDivElement>) => {
  const { project, isLoading } = useProjectsItemContext();
  const { getRegionSafe } = usePlatforms();

  const region = getRegionSafe(project?.platform_id ?? '', project?.region_id ?? '');

  if (isLoading || !project) {
    return <ProjectWidgetPlaceholder />;
  }

  return (
    <Widget
      {...props}
      title="Compute endpoint"
      // links={[
      //   {
      //     as: 'div',
      //     children: 'Configure',
      //   },
      // ]}
    >
      <WidgetBody className={styles.root}>
        <WidgetTable>
          <tr>
            <td>Region</td>
            <td><b>{region?.name}</b></td>
          </tr>
        </WidgetTable>
      </WidgetBody>
    </Widget>
  );
};
