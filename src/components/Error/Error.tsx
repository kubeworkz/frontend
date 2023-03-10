/* eslint-disable react/no-array-index-key */

import React, { PropsWithChildren } from 'react';
import errDefault from '#shared/assets/images/error_hdd.webp';
import { Button } from '#shared/components/Button/Button';

import { CONSOLE_BASE_ROUTE } from '#shared/routes';
import styles from './Error.module.css';

export interface ErrorData {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  footerLinks?: React.ReactNode;
}

export interface ErrorProps extends ErrorData {
  imgSrc?: string;
  preset?: Presets;
}

export enum Presets {
  NotFound = 404,
  Unknown = 'Unknown',
}

const PRESETS: Record<Presets, ErrorProps> = {
  [Presets.Unknown]: {
    title: 'Something went wrong',
  },
  [Presets.NotFound]: {
    imgSrc: errDefault,
    title: 'Not found',
    actions: (
      <Button
        as="a"
        href={CONSOLE_BASE_ROUTE}
      >
        Back to Console
      </Button>),
  },
};

export const Error = ({
  preset = Presets.Unknown,
  ...props
}: PropsWithChildren<ErrorProps>) => {
  const errData: ErrorProps = props.title ? props : PRESETS[preset];

  return (
    <div className={styles.root}>
      <div className={styles.img}>
        <img
          src={errData.imgSrc || errDefault}
          alt=""
          width={240}
          height={240}
        />
      </div>
      <div className={styles.title}>
        {errData.title || 'Something went wrong'}
      </div>
      {errData.subtitle
        && (
        <div className={styles.subtitle}>
          {errData.subtitle}
        </div>
        )}
      {errData.actions && (
        <div className={styles.actions}>
          {errData.actions}
        </div>
      )}
      {errData.footerLinks
        && (
        <div className={styles.footer}>
          {Array.isArray(errData.footerLinks)
            ? errData.footerLinks.map((item, index) => (
              <div
                key={index}
                className={styles.footer_item}
              >
                {item}
              </div>
            ))
            : errData.footerLinks}
        </div>
        )}
      {props.children}
    </div>
  );
};
