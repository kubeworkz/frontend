import {
  useEffect, useRef, useState,
} from 'react';
import { FilterOperator, DataFiltersProps } from './DataFilters';

const PREDICATES: Record<
FilterOperator,
(filter: any) => (value: any) => boolean
> = {
  '=': (filter) => (value) => filter === value,
  '!=': (filter) => (value) => filter !== value,
  contains: (filter: string) => (value: string) => filter.trim() === ''
    || value.toLowerCase().indexOf(filter.toLowerCase()) !== -1,
  '<': (filter) => (value) => value < filter,
  '<=': (filter) => (value) => value <= filter,
  '>': (filter) => (value) => value > filter,
  '>=': (filter) => (value) => value >= filter,
};

const DATA_FILTER_DELAY = 300;

export const useDataFilters = <T>(
  data: T[],
  filterValues: { [K in keyof T]?: T[K] },
  filters: DataFiltersProps<Partial<T>>['filters'],
) => {
  const [filtered, setFiltered] = useState(data);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      const predicate = (Object.keys(filters) as Array<keyof T>).reduce(
        (acc, field) => {
          const operator = filters[field];
          const filterValue = filterValues[field];
          return (val: T) => acc(val) && PREDICATES[operator](filterValue)(val[field]);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (val: T) => true,
      );

      setFiltered(data.filter(predicate));
      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }, DATA_FILTER_DELAY);
  }, [data, filterValues, filters]);

  return filtered;
};
