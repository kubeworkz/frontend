import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { IAceEditorProps } from 'react-ace/lib/ace';

import { CopyButton } from '#shared/components/CopyButton/CopyButton';
import { Card } from '#shared/components/Card/Card';
import { AceEditor } from '#shared/components/Ace/Ace';

import styles from './Code.module.css';

interface CodeSpanProps extends HTMLAttributes<HTMLSpanElement> {
  children: string;
}

export const CodeSpan = ({ children, className, ...props }: CodeSpanProps) => (
  <span
    className={classNames(className, styles.code, styles.span)}
    {...props}
  >
    {children}
  </span>
);

interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | string;
  textToCopy?: string;
  className?: string;
  onCopy?: () => void;
  copyDisabled?: boolean;
}

export const CodeBlock = ({
  children, className, copyDisabled, textToCopy, onCopy, ...props
}: CodeBlockProps) => {
  const copyBtnText = textToCopy || (children && typeof children === 'string' ? children : '');
  return (
    <Card
      className={classNames(className, styles.code)}
      {...props}
      action={copyBtnText && (
        <CopyButton
          className={styles.copy}
          text={copyBtnText}
          disabled={copyDisabled}
          onCopy={onCopy}
        />
      )}
    >
      <div className={styles.block}>
        {children}
      </div>
    </Card>
  );
};

interface HighlightedCodeBlockProps extends IAceEditorProps {
  children?: string;
  onCopy?: () => void;
}

export const HighlightedCodeBlock = ({
  children, className, onCopy, height, ...props
}: HighlightedCodeBlockProps) => (
  <Card
    className={classNames(className, styles.code)}
    innerClassName={styles.scrollable}
    action={children && (
      <CopyButton
        className={styles.copy}
        text={children}
        onCopy={onCopy}
      />
    )}
    style={{ height }}
  >
    <AceEditor
      {...props}
      height="auto"
      value={children}
      readOnly
      wrapEnabled
      setOptions={{
        useWorker: false,
        showLineNumbers: false,
        showGutter: false,
        highlightActiveLine: false,
        showFoldWidgets: false,
        showPrintMargin: false,
        maxLines: Infinity,
      }}
    />
  </Card>
);
