import React, { CSSProperties, useState } from 'react';
import classNames from 'classnames';
import { throttle } from 'throttle-debounce';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { QueryLayoutEditor } from '../QueryLayoutEditor/QueryLayoutEditor';
import { QueryResult } from '../../QueryResult/QueryResult';
import { QueryLayout, useQueryContext } from '../../../app/pages/Query/queryContext';
import { QueryLayoutHeader } from '../QueryLayoutHeader/QueryLayoutHeader';
import { QueryLayoutActions } from '../QueryLayoutActions/QueryLayoutActions';
import { QuerySidebar } from '../QuerySidebar/QuerySidebar';
import styles from './QueryLayoutMain.module.css';

const DIVIDER_SIZE = 8;
const ACTIONS_SIZE = 62;

export const QueryLayoutMain = () => {
  const { state: { layout, result, isQueryRunning }, editorRef } = useQueryContext();

  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const [maxConstraints, setMaxConstraints] = useState<[number, number]>([800, 800]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const isCols = layout === QueryLayout.Cols;

  const onResizeEditor = (event: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    if (isCols) {
      setWidth(size.width);
    } else {
      setHeight(size.height);
    }
  };

  const onResizeWindow = throttle(300, () => {
    if (containerRef.current) {
      setMaxConstraints([
        containerRef.current.offsetWidth - 200,
        containerRef.current.offsetHeight - 200,
      ]);
    }
  });

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(Math.floor((containerRef.current.offsetWidth + DIVIDER_SIZE) / 2));
      setHeight(Math.floor((containerRef.current.offsetHeight + DIVIDER_SIZE) / 2));
      setMaxConstraints([
        containerRef.current.offsetWidth - 200,
        containerRef.current.offsetHeight - 200,
      ]);
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('resize', onResizeWindow);
    return () => {
      window.removeEventListener('resize', onResizeWindow);
    };
  }, []);

  let resultStyles: CSSProperties = isCols
    ? { width: `calc(100% - ${width}px)`, height: '100%' }
    : { height: `calc(100% - ${height}px)`, width: '100%' };
  if (containerRef.current) {
    resultStyles = isCols
      ? { width: `${containerRef.current?.offsetWidth - width}px`, height: '100%' }
      : { height: `${containerRef.current?.offsetHeight - height - ACTIONS_SIZE + (DIVIDER_SIZE / 2)}px`, width: '100%' };
  }

  return (
    <div
      className={classNames(styles.root)}
      ref={containerRef}
    >
      <div className={styles.sidebar}>
        <QuerySidebar />
      </div>
      <div className={styles.main}>
        <QueryLayoutHeader />
        <Resizable
          height={height}
          width={width}
          axis={isCols ? 'x' : 'y'}
          onResize={onResizeEditor}
          minConstraints={[200, 200]}
          maxConstraints={maxConstraints}
          handle={(
            <div
              className={classNames(styles.handle, {
                [`${styles.handle_e}`]: isCols,
                [`${styles.handle_s}`]: !isCols,
              })}
              style={{
                minWidth: `${DIVIDER_SIZE}px`,
                minHeight: `${DIVIDER_SIZE}px`,
              }}
            />
  )}
        >
          <div
            className={classNames(styles.part, styles.part_editor)}
            style={isCols
              ? { width: `${width}px`, height: '100%' }
              : { height: `${height}px`, width: '100%' }}
          >
            <div className={styles.editor}>
              <QueryLayoutEditor
                ref={editorRef}
                size={isCols
                  ? { width: `${width - DIVIDER_SIZE - ACTIONS_SIZE}px` }
                  : { height: `${height - (DIVIDER_SIZE / 2) - ACTIONS_SIZE}px` }}
              />
            </div>
            <QueryLayoutActions />
          </div>
        </Resizable>
        <div
          className={classNames(styles.part, styles.part_result)}
          style={resultStyles}
        >
          <QueryResult result={result} isQueryRunning={isQueryRunning} />
        </div>
      </div>
    </div>
  );
};
