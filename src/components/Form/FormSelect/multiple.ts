interface Option {
  value: any;
  [key: string]: any;
}

export function findOptions<T extends Option>(opts: Array<T>, value: string, strict?: false) {
  if (!value) {
    return undefined;
  }

  const params = value.split(',', 100);

  const result = opts.filter((o) => params.indexOf(o.value) !== -1);

  return strict ? result : (result || {
    value,
    label: value,
  });
}
