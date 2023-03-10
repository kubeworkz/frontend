import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(advancedFormat);
dayjs.extend(utc);

export enum DateTimeFormat {
  Default = 'MMM\xa0D,\xa0YYYY h:mm\xa0a',
  Short = 'MMM\xa0D,\xa0YYYY h:mm\xa0a',
  Date = 'MMM\xa0D,\xa0YYYY',
  AdminFilter = 'MM/DD/YYYY HH:mm',
  AdminFilterDate = 'MM/DD/YYYY',
  AdminFilterTime = ' HH:mm',
  AdminDefault = 'MMM\xa0D,\xa0YYYY h:mm:ss\xa0a',
  AdminQuery = 'x',
  BranchDateFormat = 'MM/DD/YYYY',
  BranchTimeFormat = 'hh:mm:ss a',
  BranchDateTimeFormat = 'MM/DD/YYYY hh:mm:ss a',
  LimitsResetAtFormat = 'MMMM, D',
}

export const formatDate = (datetime: string, format?: DateTimeFormat) => (
  dayjs(datetime).format(format || DateTimeFormat.Default)
);
