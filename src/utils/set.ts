export const UNKNOWN = Symbol('UNKNOWN');

export const isInSet = <T>(set: Set<T>) => (value: any): value is T => set.has(value);

export const conformsTo = <T>(set: Set<T>) => (value: any) => (
  (isInSet(set)(value) ? value : UNKNOWN)
);
