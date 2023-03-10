/* eslint-disable react/no-array-index-key */
import React from 'react';

import { Text } from '#shared/components/Text/Text';

import classNames from 'classnames';
import styles from './QueryResultTable.module.css';

interface QueryResultTableProps {
  data?: {
    fields?: React.ReactNode[] | null;
    rows?: React.ReactNode[][] | null;
    truncated: boolean;
  };
  scrollIsDisabled?: boolean;
  offset?: number;
}

export const QueryResultTable = ({
  data, scrollIsDisabled = false, offset = 0,
}: QueryResultTableProps) => {
  if (!data) {
    return null;
  }

  const { fields, rows } = data;

  if (!fields || !rows) {
    return <Text appearance="secondary">Request completed successfully</Text>;
  }

  return (
    <div className={styles.root}>
      <div className={classNames(!scrollIsDisabled && styles.scrollContainer)}>
        <table className={styles.table}>
          <thead>
            <tr className={classNames(styles.row, styles.row_header)}>
              <th
                className={classNames(styles.cell, styles.cell_header, styles.cell_row_number)}
              >
                #
              </th>
              {fields.map((field, index) => (
                <th className={classNames(styles.cell, styles.cell_header)} key={`th_${index}`}>{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              rows.map((r, rowIndex) => (
                <tr
                  key={`row_${rowIndex}`}
                  className={classNames(styles.row, styles.row_data)}
                >
                  <td
                    className={classNames(
                      styles.cell,
                      styles.cell_data,
                      styles.cell_row_number,
                    )}
                  >
                    {offset + rowIndex + 1}
                  </td>
                  {r.map((cell, cellIndex) => (
                    <td
                      key={`cell_${rowIndex}_${cellIndex}`}
                      className={classNames(styles.cell, styles.cell_data)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};
