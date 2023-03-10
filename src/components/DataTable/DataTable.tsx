import React, {
  HTMLProps, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes,
} from 'react';
import classNames from 'classnames';
import { Skeleton } from '#shared/components/Skeleton/Skeleton';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';

import _ from 'lodash';
import {
  DataPlaceholderBadge,
  DataPlaceholderProps,
} from '#shared/components/DataPlaceholder/DataPlaceholder';
import styles from './DataTable.module.css';

export type DataTableOrder = 'asc' | 'desc';

export type DataTableColumnRenderer<DataItemType> = (
  dataItem: DataItemType,
  searchWords: string[],
) => React.ReactNode;

export interface DataTableColumn<DataItemType, K = string> {
  label?: React.ReactNode;
  key: K;
  renderValue?: DataTableColumnRenderer<DataItemType>;
  tdAttrs?: TdHTMLAttributes<HTMLElement>;
  sortable?: boolean;
}

export interface DataTableProps<DataItemType, K = string> {
  cols: Array<DataTableColumn<DataItemType, K>>;
  sort?: K | string;
  order?: DataTableOrder;
  onChangeSort?(state: { sort: K, order: DataTableOrder }): void;
  keyField?: string;
  keyPrefix?: string;
  data?: DataItemType[];
  isLoading?: boolean;
  error?: string;
  dataPlaceholder?: React.ReactNode; // will be wrapped with Text
  dataPlaceholderNode?: React.ReactNode;
  dataPlaceholderProps?: DataPlaceholderProps;
  onRowClick?(dataItem: DataItemType, e: React.MouseEvent): void;
  searchWords?: string[];
}

export function DataTable<T extends Record<string, any>>({
  cols,
  data,
  keyField = 'id',
  keyPrefix = '',
  isLoading = false,
  error,
  dataPlaceholder = 'Table is empty :(',
  dataPlaceholderNode,
  dataPlaceholderProps,
  onRowClick,
  onChangeSort,
  sort,
  order,
  searchWords = [],
  ...tableProps
}: DataTableProps<T> & TableHTMLAttributes<HTMLTableElement>) {
  let tableBody;

  if (error) {
    return (
      <div className={styles.empty}>
        Error:
        {error}
      </div>
    );
  } if (isLoading) {
    tableBody = (
      <>
        {_.times(3, (index) => (
          <tr className={classNames(styles.row, styles.rowData)} key={index}>
            {cols.map((col) => (
              <td
                key={`${index}_${col.key}`}
                {...col.tdAttrs}
                className={classNames(col.tdAttrs?.className, styles.cell, styles.cellData)}
              >
                <Skeleton
                  height={12}
                  width={(typeof col.label === 'string' ? col.label.length : 10) * 7}
                />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  } else if (!data || !data.length) {
    if (dataPlaceholderNode) {
      return <>{dataPlaceholderNode}</>;
    }
    if (dataPlaceholderProps) {
      return <DataPlaceholderBadge {...dataPlaceholderProps} />;
    }

    return <DataPlaceholderBadge title={dataPlaceholder} />;
  } else {
    tableBody = data.map((row) => {
      const trProps: HTMLProps<any> = {
        key: `${keyPrefix}${row[keyField]}`,
        className: classNames(styles.row, styles.rowData, {
          [`${styles.rowClickable}`]: !!onRowClick,
        }),
      };

      if (onRowClick) {
        trProps.onClick = (e) => onRowClick(row, e);
      }

      return (
        <tr {...trProps}>
          {cols.map((col, colIndex) => {
            const value = col.renderValue ? col.renderValue(row, searchWords) : row[col.key];
            const alignProps: ThHTMLAttributes<HTMLTableCellElement> = colIndex === cols.length - 1
              ? { align: 'right' } : {};

            return (
              <td
                key={col.key}
                {...col.tdAttrs}
                {...alignProps}
                className={classNames(col.tdAttrs?.className, styles.cell, styles.cellData)}
              >
                {value}
              </td>
            );
          })}
        </tr>
      );
    });
  }

  return (
    <div className={styles.container}>
      <table
        {...tableProps}
        data-qa="data-table"
        className={classNames(tableProps.className, styles.table)}
      >
        <tbody>
          <tr className={classNames(styles.row, styles.rowHeader)}>
            {cols.map((col, index) => {
              const alignProps: ThHTMLAttributes<HTMLTableCellElement> = index === cols.length - 1
                ? { align: 'right' } : {};

              let inner = col.sortable && onChangeSort
                ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => onChangeSort({
                      sort: col.key,
                      order: sort === col.key && order === 'asc' ? 'desc' : 'asc',
                    })}
                  >
                    {col.label}
                    {sort === col.key
                      ? <SvgIcon name={order === 'asc' ? 'sort-asc-24' : 'sort-desc-24'} />
                      : <SvgIcon name="sort-24" />}
                  </button>
                )
                : col.label;

              if (isLoading) {
                inner = (
                  <Skeleton
                    height={12}
                    width={(typeof col.label === 'string' ? col.label.length : 8) * 7}
                  />
                );
              }

              return (
                <th
                  key={`header_${col.key}`}
                  {...alignProps}
                  {...col.tdAttrs}
                  className={classNames(styles.cell, styles.cellHeader, col.tdAttrs?.className)}
                >
                  {inner}
                </th>
              );
            })}
          </tr>
          {tableBody}
        </tbody>
      </table>
    </div>
  );
}
