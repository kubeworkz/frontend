export const humanizeRam = (s: number) => (
  s >= 1024
    ? Math.floor(s / 1024)
    : Math.floor((s * 10) / 1024) / 10
);

// Display megabytes as GB with 2 decimal places
export const mbAsGB = (s: number) => (
  // XXX: linter goes crazy here, that's why so many parentheses
  Math.round((s * 100) / 1024) / 100
);

// Display bytes as GB with 2 decimal places
export const bytesAsGB = (s: number) => (
  Math.round((s * 100) / (1024 * 1024 * 1024)) / 100
);
