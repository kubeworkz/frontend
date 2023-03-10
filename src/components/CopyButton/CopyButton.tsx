import React, {
  HTMLAttributes, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';

import styles from './CopyButton.module.css';

interface CopyButtonProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
  onCopy?: () => void;
  disabled?: boolean;
}

export const CopyButton = ({
  text, className, disabled, onCopy, ...props
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const copiedTimerId = useRef<number>();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const clearTimer = React.useCallback(() => {
    window.clearTimeout(copiedTimerId.current);
  }, []);

  const onCopySuccess = React.useCallback(() => {
    setCopied(true);
    if (onCopy) {
      onCopy();
    }
    copiedTimerId.current = window.setTimeout(() => {
      setCopied(false);
    }, 700);
  }, [onCopy]);

  const onClick = React.useCallback(() => {
    if (inputRef.current) {
      clearTimer();
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 99999); /* For mobile devices */

      navigator.clipboard.writeText(inputRef.current.value);
      onCopySuccess();
    }
  }, [onCopySuccess]);

  useEffect(() => clearTimer, []);

  return (
    <div
      className={classNames(className, styles.root)}
      {...props}
    >
      <textarea value={text} readOnly hidden ref={inputRef} />
      <button
        className={styles.btn}
        type="button"
        disabled={disabled}
        onClick={onClick}
      >
        <SvgIcon name={copied ? 'check-24' : 'copy_20'} />
      </button>
    </div>
  );
};
