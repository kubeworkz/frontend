import React, { PropsWithChildren } from 'react';

import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { Tippy } from '#shared/components/Tippy/Tippy';

import styles from './Hint.module.css';

interface HintProps {}

export const Hint = ({ children }: PropsWithChildren<HintProps>) => (
  <div
    className={styles.root}
  >
    <div className={styles.hint}>
      <Tippy content={children}>
        <SvgIcon name="hint-12" />
      </Tippy>
    </div>
  </div>
);
