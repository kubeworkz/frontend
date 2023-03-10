import React, { ForwardedRef } from 'react';
import { IAceEditorProps } from 'react-ace/lib/ace';
import { IDiffEditorProps } from 'react-ace';

const AceEditorComponent = React.lazy(async () => {
  await import('ace-builds/src-noconflict/ace');
  await import('ace-builds/webpack-resolver');
  return import('react-ace/lib/ace');
});

export const AceEditor = React.forwardRef((
  props: IAceEditorProps,
  ref: ForwardedRef<any>,
) => (
  <React.Suspense fallback={<div style={{ height: props.height }} />}>
    <AceEditorComponent
      {...props}
      ref={ref}
    />
  </React.Suspense>
));
AceEditor.displayName = 'AceEditor';

const AceDiffComponent = React.lazy(async () => {
  await import('ace-builds/src-noconflict/ace');
  await import('ace-builds/webpack-resolver');
  return import('react-ace/lib/diff');
});

export const AceDiff = React.forwardRef((
  props: IDiffEditorProps,
  ref: ForwardedRef<any>,
) => (
  <React.Suspense fallback={<div style={{ height: props.height }} />}>
    <AceDiffComponent
      {...props}
      ref={ref}
    />
  </React.Suspense>
));
AceDiff.displayName = 'AceDiff';
