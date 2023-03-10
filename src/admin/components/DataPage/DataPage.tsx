import React, {
  ForwardedRef,
  forwardRef,
  useState,
} from 'react';

import { DataTable, DataTableProps } from '#shared/components/DataTable/DataTable';
import { parse } from 'query-string';
import { useLocation } from 'react-router-dom';
import { Loader } from '#shared/components/Loader/Loader';
import { Pagination } from '#shared/components/Pagination/Pagination';

import { debounce } from 'throttle-debounce';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { isString } from 'lodash';
import styles from './DataPage.module.css';

interface PaginationOpts {
  limit?: number;
  offset?: number;
}

interface SortOpts {
  sort?: string;
  order?: 'asc' | 'desc';
}

interface SearchStringOpts {
  search?: string;
}

type GetterOptions<F> = F & PaginationOpts & SortOpts & SearchStringOpts;
type FilterOptions<F> = F & SearchStringOpts;

const prepareFilters = <F extends Record<string, unknown>>(filters: F) => Object.fromEntries(
  Object.entries(filters).map(([key, value]) => [
    key,
    isString(value) ? value.trim() : value,
  ]),
);

export interface FilterComponentProps<F> {
  value: FilterOptions<F>;
  onChange(filters: Partial<FilterOptions<F>>): void;
  disabled?: boolean;
}

interface DataState<D> extends SortOpts, PaginationOpts {
  data: D[];
  total: number;
}

export interface DataPageRef {
  fetch(): void;
}

interface DataPageProps<F extends {}, D extends {}> {
  get(opts: GetterOptions<F>): Promise<DataState<D>>;
  title?: string;
  tableProps: DataTableProps<D, string>; // cols, etc.
  filtersComponent?: React.ComponentType<FilterComponentProps<F>>;
  getInitialFilters?: (parsedQuery: object) => F;
  pageLimit?: number;
  defaultSort?: SortOpts;
}

function DataPageComponent<F extends { search?: string }, D extends {}>({
  title,
  filtersComponent: FiltersForm,
  tableProps,
  get,
  getInitialFilters,
  pageLimit: initialPageLimit = 20,
  defaultSort,
  // stringifyFilters,
}: DataPageProps<F, D>, ref: ForwardedRef<DataPageRef>) {
  const { search } = useLocation();
  const parsedQuery = React.useMemo(() => parse(search, { parseNumbers: true }), []);

  const [dataState, setDataState] = useState<DataState<D> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<F>(
    getInitialFilters ? getInitialFilters(parsedQuery) : parsedQuery as F,
  );
  const [offset, setOffset] = useState<number>(
    typeof parsedQuery.offset === 'number' ? parsedQuery.offset : 0,
  );
  const [sort, setSort] = useState<SortOpts>({
    sort: typeof parsedQuery.sort === 'string' ? parsedQuery.sort : defaultSort?.sort,
    order: parsedQuery.order
      && typeof parsedQuery.order === 'string'
      && ['asc', 'desc'].includes(parsedQuery.order)
      ? parsedQuery.order as SortOpts['order'] : defaultSort?.order,
  });

  const pageLimit = React.useMemo(
    () => (typeof parsedQuery.limit === 'number' ? parsedQuery.limit : initialPageLimit),
    [],
  );

  const update = React.useCallback(debounce(500, (f) => {
    setIsLoading(true);
    return get(f).then((d) => {
      setDataState(d);
    }).finally(() => setIsLoading(false));
  }), []);

  const onChangeFilters = React.useCallback(
    (newFilters: F) => {
      setFilters((oldFilters) => ({
        ...oldFilters,
        ...newFilters,
      }));
      setOffset(0);
    },
    [],
  );

  const onClickFetch = React.useCallback(() => {
    const params = {
      ...prepareFilters(filters),
      ...sort,
      offset,
    };

    update({
      ...params,
      limit: pageLimit,
    });
  }, [filters, sort, offset]);

  React.useEffect(() => {
    const params = {
      ...prepareFilters(filters),
      ...sort,
      offset,
    };

    update({
      ...params,
      limit: pageLimit,
    });

    if (window) {
      const url = new URL(window.location.href);
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value.toString());
        } else {
          url.searchParams.delete(key);
        }
      });
      window.history.pushState({}, '', url);
    }
  }, [filters, offset, sort]);

  React.useEffect(() => {
    if (ref) {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      ref.current = {
        fetch: onClickFetch,
      };
    }
  }, [ref]);

  return (
    <div className={styles.root}>
      <h2
        className={styles.header}
      >
        {title || 'Data'}
        {dataState && !!dataState.total && (
          <span className={styles.total}>
            {' '}
            (
            {dataState.total}
            )
            {' '}
          </span>
        )}
        {isLoading
          ? (
            <div className={styles.header_icon}>
              <Loader />
            </div>
          ) : (
            <button
              type="button"
              className={styles.header_icon}
              onClick={onClickFetch}
            >
              <SvgIcon name="reset_24" />
            </button>
          )}
      </h2>
      <div>
        {
          FiltersForm
            && (
            <FiltersForm
              value={filters}
              onChange={onChangeFilters}
            />
            )
         }
      </div>
      <DataTable
        {...tableProps}
        isLoading={dataState === null}
        data={dataState ? dataState.data : []}
        onChangeSort={setSort}
        sort={sort.sort}
        order={sort.order}
      />
      {dataState && (
        <Pagination
          limit={pageLimit}
          offset={offset}
          total={dataState.total}
          onChangeOffset={setOffset}
        />
      )}
    </div>
  );
}

export const DataPage = forwardRef(DataPageComponent) as <F extends {}, D extends {}>(
  props: DataPageProps<F, D> & { ref?: ForwardedRef<DataPageRef> }
) => ReturnType<typeof DataPageComponent>;
