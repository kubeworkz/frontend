import { Operation } from '#api_client/generated/api';
import dayjs from 'dayjs';

const bytesUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function humanReadableBytes(x: number) {
  let l = 0;
  let n = x;

  while (n >= 1024) {
    l += 1;
    n /= 1024;
  }

  return (`${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${bytesUnits[l]}`);
}

export function secondsToHours(seconds: number) {
  return (seconds / 3600).toFixed(2);
}

export function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

export const formatOpDuration = ({
  created_at,
  updated_at,
}: Pick<Operation, 'created_at' | 'updated_at'>) => {
  const duration = dayjs(updated_at).diff(dayjs(created_at), 'millisecond');

  if (duration < 1000) {
    return '< 1 s';
  }

  return `${Math.floor(duration / 1000)} s`;
};

const MILLI_SEC_IN_NS = 1000000;
const SEC_IN_NS = 1000 * MILLI_SEC_IN_NS;
const MIN_IN_NS = 60 * SEC_IN_NS;
// takes duration in nano seconds
export const humanizeNanoseconds = (duration: number) => {
  if (duration < MILLI_SEC_IN_NS) {
    return '< 1ms';
  }

  if (duration < SEC_IN_NS) {
    return `${Math.floor(duration / MILLI_SEC_IN_NS)}ms`;
  }

  if (duration > MIN_IN_NS) {
    const minutes = duration / MIN_IN_NS;
    const secInNs = duration % MIN_IN_NS;

    const sec = secInNs > SEC_IN_NS && ` ${Math.floor(secInNs / SEC_IN_NS)}s`;

    return `${Math.floor(minutes)}m${sec}`;
  }

  return `${Math.floor(duration / SEC_IN_NS)}s`;
};
const SEC_IN_HOUR = 3600;
const CPU_HOURS_UNIT = 'CPU×h';
export const humanizeCPUHours = (s: number) => {
  if (s < SEC_IN_HOUR) {
    return `< 1 ${CPU_HOURS_UNIT}`;
  }

  return `${Math.floor(s / SEC_IN_HOUR)} ${CPU_HOURS_UNIT}`;
};

const ACTIVE_TIME_HOURS_UNIT = 'hour';

const localize = (key: string, n: number = 1) => `${key}${n === 1 ? '' : 's'}`;

export const humanizeActiveTime = (s: number) => {
  if (s < SEC_IN_HOUR) {
    return `< 1 ${localize(ACTIVE_TIME_HOURS_UNIT)}`;
  }

  const amount = Math.floor(s / SEC_IN_HOUR);

  return `${amount} ${localize(ACTIVE_TIME_HOURS_UNIT, amount)}`;
};
