import React from 'react';
import { AceDiff } from '#shared/components/Ace/Ace';

import { Button } from '#shared/components/Button/Button';

import styles from './SettingsEditor.module.css';

interface TabAction {
  label: string;
  onClick(): void;
}

interface ConsoleSettingsEditorProps {
  leftTabValue: string;
  leftTabLabel: string;
  leftTabActions?: TabAction[];

  rightTabValue: string;
  rightTabLabel: string;
  rightTabActions?: TabAction[];

  onChangeRightValue(s: string): void;
}

export const SettingsEditor = ({
  leftTabValue,
  leftTabLabel,
  leftTabActions,
  rightTabValue,
  rightTabLabel,
  rightTabActions,
  onChangeRightValue,
}: ConsoleSettingsEditorProps) => (
  <div className={styles.editor}>
    <div className={styles.tabs}>
      <div className={styles.tab_item}>
        <span>
          {leftTabLabel}
        </span>
        {leftTabActions?.map((action) => (
          <Button
            key={action.label}
            size="s"
            onClick={action.onClick}
            appearance="default"
          >
            {action.label}
          </Button>
        ))}
      </div>
      <div className={styles.tab_item}>
        <span>
          {rightTabLabel}
        </span>
        {rightTabActions?.map((action) => (
          <Button
            key={action.label}
            size="s"
            onClick={action.onClick}
            appearance="default"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
    <AceDiff
      mode="json"
      theme="github"
      width="100%"
      height="400px"
      value={[leftTabValue, rightTabValue]}
      onChange={([,value]) => onChangeRightValue(value)}
      setOptions={{
        useWorker: false,
      }}
    />
  </div>
);
