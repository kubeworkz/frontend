import { padStart } from 'lodash';
import React from 'react';

export const CurrentTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneOffset = new Date().getTimezoneOffset();

  return (
    <span>
      {timezone}
      ,
      {' '}
      GMT
      {timezoneOffset > 0 ? '-' : '+'}
      {padStart(String(Math.floor(Math.abs(timezoneOffset) / 60)), 2, '0')}
      :
      {padStart(String(Math.abs(timezoneOffset) % 60), 2, '0')}
    </span>
  );
};
