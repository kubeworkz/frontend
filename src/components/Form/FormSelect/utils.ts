interface Option {
  value: any;
  [key: string]: any;
}

export function findOption<T extends Option>(opts: Array<T>, value: any, strict?: false) {
  if (!value) {
    return undefined;
  }

  const result = opts.find((o) => o.value === value);

  return strict ? result : (result || {
    value,
    label: value,
  });
}
