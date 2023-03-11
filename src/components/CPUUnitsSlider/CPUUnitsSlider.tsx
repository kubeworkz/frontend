import React, { useMemo } from 'react';

import classNames from 'classnames';
// import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch';
import { FormLabel } from '../../components/Form/FormLabel/FormLabel';
import { Range, getTrackBackground } from 'react-range';
import styles from './CPUUnitsSlider.module.css';

export const CU_SCALE = [0.25, 0.5, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32];

const formatTick = (v: number) => (v < 1 ? `1 / ${1 / v}` : v);

export type CPUUnitsValue = {
  min: number;
  max: number;
};

interface EndpointFormCPUUnitsProps {
  value: CPUUnitsValue;
  onChange(v: CPUUnitsValue): void;
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
  isEditMinAvailable?: boolean;
}

const getCPUUnitLabel = (v: number) => (` CPU, ${v * 4} GB of RAM`);

export const CPUUnitsSlider = ({
  value,
  onChange,
  minValue = 0.25,
  maxValue = 8,
  disabled,
  isEditMinAvailable = false,
}: EndpointFormCPUUnitsProps) => {
  const valueMaxIdx = useMemo(() => CU_SCALE.indexOf(value.max), [value.max]);
  const valueMinIdx = useMemo(() => CU_SCALE.indexOf(value.min), [value.min]);
  const limitMaxIdx = useMemo(() => CU_SCALE.indexOf(maxValue), [maxValue]);
  const limitMinIdx = useMemo(() => CU_SCALE.indexOf(minValue), [minValue]);

  return (
    <div className={classNames(styles.root, disabled ? styles.root_disabled : '')}>
      <div className={classNames(styles.row, styles.row_flex)}>
        <div>
          {
              isEditMinAvailable
               && (
                 <div className={styles.input_row}>
                   <FormLabel className={styles.inputLabel}>
                     min:
                   </FormLabel>
                   <span className={styles.inputDescription}>
                     {value.min}
                     {getCPUUnitLabel(value.min)}
                   </span>
                 </div>
               )
            }
          <div className={styles.input_row}>
            <FormLabel className={styles.inputLabel}>
              {isEditMinAvailable ? 'max:' : 'size:'}
            </FormLabel>
            <span className={styles.inputDescription}>
              {value.max}
              {getCPUUnitLabel(value.max)}
            </span>
          </div>
        </div>
        <div>
          {/* <ToggleSwitch */}
          {/*  label="Set only the Max value" */}
          {/*  onChange={(e) => setScaleToZero(e.target.checked)} */}
          {/* /> */}
        </div>
      </div>
      <div className={styles.row}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Range
            values={isEditMinAvailable ? [valueMinIdx, valueMaxIdx] : [valueMaxIdx]}
            step={1}
            disabled={disabled}
            min={limitMinIdx}
            max={limitMaxIdx}
            onChange={(values) => {
              onChange(isEditMinAvailable ? {
                min: CU_SCALE[values[0]],
                max: CU_SCALE[values[1]],
              } : {
                min: value.min,
                max: CU_SCALE[values[0]],
              });
            }}
            renderTrack={({ props, children }) => (
              <div
                role="presentation"
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                className={styles.trackContainer}
                style={{
                  ...props.style,
                }}
              >
                <div
                  ref={props.ref}
                  className={styles.track}
                  style={{
                    width: '100%',
                    background: getTrackBackground({
                      values: isEditMinAvailable ? [valueMinIdx, valueMaxIdx] : [0, valueMaxIdx],
                      colors: isEditMinAvailable
                        ? ['var(--bg-secondary)', 'var(--bg-highlight)', 'var(--bg-secondary)']
                        : ['var(--bg-secondary)', 'var(--bg-secondary)', 'var(--bg-secondary)'],
                      min: limitMinIdx,
                      max: limitMaxIdx,
                    }),
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                className={styles.thumb}
                style={{
                  ...props.style,
                }}
              >
                <div
                  className={classNames(styles.thumbDot, isDragged && styles.thumbDot_dragged)}
                />
              </div>
            )}
            renderMark={({ props, index }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                }}
                className={classNames(
                  styles.mark,
                  index === limitMinIdx && styles.mark_first,
                  index === limitMaxIdx && styles.mark_last,
                )}
              >
                {formatTick(CU_SCALE[index])}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};
