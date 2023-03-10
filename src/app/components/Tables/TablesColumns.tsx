import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

import { Section } from '#shared/components/Section/Section';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { Collapsible } from '#shared/components/Collapsible/Collapsible';

import { ColumnDescription, useTables } from '../../pages/Tables/tablesContext';
import styles from './Tables.module.css';

type TableSectionProps = {
  table: string;
  columns: ColumnDescription[];
};
export const TableSection = ({ table, columns }: TableSectionProps) => {
  const { onSelectTable, selectedTable } = useTables();
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setCollapsed((s) => !s);
    },
    [],
  );
  const onTableNameClick = useCallback(() => onSelectTable(table), [table]);

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        className={classNames(styles.tableHeader, {
          [styles.selected]: selectedTable === table,
        })}
        title={table}
        data-qa="table-name"
        onKeyDown={(event) => event.key === 'Enter' && onTableNameClick}
        onClick={onTableNameClick}
      >
        <SvgIcon
          name="chevron-down_16"
          onClick={toggleCollapsed}
          data-qa="table-collapse"
          className={classNames(styles.icon_collapsible, {
            [styles.collapsed]: collapsed,
          })}
        />
        &nbsp;
        {table}
      </button>
      <Collapsible collapsed={collapsed}>
        {columns.map(({ columnName, udtName }) => (
          <div key={columnName} className={styles.columnDescription} data-qa="column-description" data-qa-name={columnName}>
            <span title={columnName} className={styles.columnName} data-qa="column-name">
              {columnName}
            </span>
            <span title={udtName} className={styles.columnType} data-qa="column-type">
              {udtName}
            </span>
          </div>
        ))}
      </Collapsible>
    </>
  );
};

export const TablesColumns = () => {
  const { tables, isLoading, columnsByTable } = useTables();

  const title = (
    <span>
      Tables
      {' '}
      <span>
        (
        {tables.length}
        )
      </span>
    </span>
  );

  return isLoading ? (
    <div />
  ) : (
    <Section className={styles.tablesColumns} header={title} collapsible>
      {tables.map((table) => (
        <TableSection
          table={table}
          columns={columnsByTable[table]}
          key={table}
        />
      ))}
    </Section>
  );
};
