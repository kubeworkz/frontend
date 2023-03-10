import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { format } from 'sql-formatter';

/* THIS PAGE IS OBSOLETE AND WILL BE REMOVED IN THE FUTURE */

import {
  DataTable,
  DataTableColumn,
} from '../../../components/DataTable/DataTable';

import { useProjectsItemContext } from '../../hooks/projectsItem';
import styles from './Insights.module.css';

const Highlight = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, [children]);

  return (
    <pre>
      <code className="language-sql">{children}</code>
    </pre>
  );
};

const renderMs = (column: string) => {
  const wrapped = (value: any) => (
    <span>
      {Number(value[column]).toFixed(4)}
      {' '}
      ms
    </span>
  );
  wrapped.displayName = 'RenderMs';

  return wrapped;
};

const columns: DataTableColumn<any>[] = [
  {
    key: 'query',
    label: 'Query',
    renderValue: (value) => {
      const [formatted, setFormatted] = useState(false);
      return (
        <div
          className={classNames(styles.query, {
            [styles.formatted]: formatted,
          })}
        >
          <button
            type="button"
            className={classNames(styles.toggle, {
              [styles.formatted]: formatted,
            })}
            onClick={() => setFormatted(!formatted)}
          >
            ▷
          </button>
          <Highlight>
            {formatted
              ? format(value.query, { language: 'postgresql' })
              : value.query}
          </Highlight>
        </div>
      );
    },
  },
  {
    key: 'calls',
    label: 'Calls',
  },
  {
    key: 'mean_exec_time',
    label: 'Mean Execution Time',
    renderValue: renderMs('mean_exec_time'),
  },
  {
    key: 'mean_plan_time',
    label: 'Mean Plan Time',
    renderValue: renderMs('mean_plan_time'),
  },
];

export const Insights = () => {
  const [data, setData] = useState<any[]>([]);
  const { project, isLoading } = useProjectsItemContext();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setDataLoading(true);
    const refreshData = async () => {
      const response = await fetch(
        `/api/v1/projects/${project?.id}/insights`,
      ).then((r) => r.json());
      setData(response.pg_stat_statements ?? []);
      setDataLoading(false);
    };
    const intervalId = setInterval(refreshData, 1000);
    return () => clearInterval(intervalId);
  }, [project?.id]);

  return (
    <div className={styles.root}>
      <DataTable cols={columns} data={data} isLoading={isLoading || dataLoading} />
    </div>
  );
};
