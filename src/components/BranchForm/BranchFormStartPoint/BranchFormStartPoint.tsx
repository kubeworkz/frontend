import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import moment from 'moment';

import { FormRadio } from '../../../components/Form/FormRadio/FormRadio';
import { FormField } from '../../../components/Form/FormField/FormField';
import { FormDateTime } from '../../../components/Form/FormDateTime/FormDateTime';
import { Hint } from '../../../components/Hint/Hint';

import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { FormInput } from '../../../components/Form/FormInput/FormInput';
import { CurrentTimezone } from '../../../components/CurrentTimezone/CurrentTimezone';
import styles from './BranchFormStartPoint.module.css';

export type StartFrom =
  | {
    type: 'head';
  }
  | {
    type: 'time';
    time: Date;
  }
  | {
    type: 'lsn';
    lsn: string;
  };

export type StartFromSelectProps = {
  value: StartFrom;
  onChange: (value: StartFrom) => void;
};

enum StartPointType {
  LSN = 'lsn',
  Head = 'head',
  Timestamp = 'timestamp',
}

const DATE_FORMAT = 'MM/DD/YYYY';
const TIME_FORMAT = 'hh:mm:ss a';
export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const BranchFormStartPoint = () => {
  const { trackUiInteraction } = useAnalytics();
  const {
    control, formState, register,
  } = useFormContext();
  const [startPointType, setStartPointType] = useState('head');

  const onChangeType = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      trackUiInteraction(AnalyticsAction.BranchFormStartingPointTypeChanged);
      setStartPointType(event.target.value);
    },
    [],
  );

  const isDateValid = React.useCallback(
    (v) => moment(v).isValid() || 'Starting point should be a valid date',
    [],
  );

  return (
    <>
      <div>
        <FormRadio onChange={onChangeType} value={StartPointType.Head} name="start_point" defaultChecked>
          Head
          <Hint>Creates a branch with data up to the current point in time.</Hint>
        </FormRadio>
      </div>
      <div>
        <FormRadio onChange={onChangeType} value={StartPointType.Timestamp} name="start_point">
          Time
          <Hint>Creates a branch with data up to the specified date and time.</Hint>
        </FormRadio>
        {startPointType === StartPointType.Timestamp && (
        <FormField
          className={styles.input}
          error={formState.errors.parent_timestamp?.message}
        >
          <Controller
            name="parent_timestamp"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Please select a starting point',
              },
              validate: {
                isDateValid,
              },
            }}
            shouldUnregister
            render={({ field }) => (
              <>
                <FormDateTime
                  value={field.value || ''}
                  dateFormat={DATE_FORMAT}
                  timeFormat={TIME_FORMAT}
                  inputProps={{
                    placeholder: DATE_TIME_FORMAT,
                  }}
                  onChange={(v) => {
                    field.onChange(
                      typeof v === 'string'
                        ? v : moment(v).format(DATE_TIME_FORMAT),
                    );
                  }}
                />
                <div className={styles.timezone}>
                  Time is picked in your local timezone:
                  <br />
                  <CurrentTimezone />
                </div>
              </>
            )}
          />
        </FormField>
        )}
      </div>
      <div>
        <FormRadio
          onChange={onChangeType}
          value={StartPointType.LSN}
          name="start_point"
        >
          LSN
          <Hint>Creates a branch with data up to the specified Log Sequence Number (LSN).</Hint>
        </FormRadio>
        {startPointType === StartPointType.LSN && (
        <FormField
          className={styles.input}
          error={formState.errors.startFrom?.message}
        >
          <FormInput {...register('parent_lsn', {
            required: { value: true, message: 'LSN is required' },
            shouldUnregister: true,
          })}
          />
        </FormField>
        )}
      </div>
    </>
  );
};
