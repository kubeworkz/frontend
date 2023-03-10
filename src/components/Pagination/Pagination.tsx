import React from 'react';

import classNames from 'classnames';
import styles from './Pagination.module.css';

interface PaginationProps {
  limit: number;
  offset?: number;
  total: number;
  onChangeOffset?: (offset: number) => void;
}

export const Pagination = ({
  limit, offset = 0, total, onChangeOffset,
}: PaginationProps) => {
  const data: {
    pageCount: number;
    currentPageIndex: number;
  } = React.useMemo(() => {
    if (!limit || !total) {
      return {
        pageCount: 0,
        currentPageIndex: 0,
      };
    }

    if (total < limit && !!offset) {
      return {
        pageCount: 2,
        currentPageIndex: 1,
      };
    }

    return {
      pageCount: Math.ceil(total / limit),
      currentPageIndex: Math.floor(offset / limit),
    };
  }, [offset, limit, total]);

  const pagesArray = React.useMemo(() => {
    let array = Array.from(Array(data.pageCount), (v, i) => i);
    if (data.pageCount < 12) {
      return array;
    }

    array = array.filter((v) => (
      v < 3
      || Math.abs(v - data.currentPageIndex) < 3
      || v >= (data.pageCount - 3)));

    return array;
  }, [data]);

  if (data.pageCount < 2) {
    return null;
  }

  return (
    <div className={styles.root}>
      {pagesArray.map((value, i) => (
        <React.Fragment key={`page_${value}`}>
          {!!i && (value - pagesArray[i - 1]) > 1
            && <div className={styles.divider}>...</div>}
          <button
            type="button"
            className={classNames(styles.item, {
              [`${styles.active}`]: value === data.currentPageIndex,
            })}
            onClick={() => onChangeOffset && onChangeOffset(value * limit)}
          >
            {value + 1}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};
