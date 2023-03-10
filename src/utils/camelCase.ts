export const camelCase = <T extends string>(s: T) => s
  .split('_')
  .map((part, idx) => (
    idx === 0
      ? part
      : `${part[0].toUpperCase()}${part.slice(1)}`))
  .join('') as CamelCase<T>;

export type CamelCase<T extends string> =
  T extends `${infer L}_${infer R}`
    ? `${L}${CamelCase<Capitalize<R>>}`
    : T;
