import React, { createRef } from 'react';
import AceEditorI from 'react-ace';
import { AceEditorProps } from 'react-ace/types';
import { debounce } from 'throttle-debounce';

import { AceEditor } from '#shared/components/Ace/Ace';

import { useProjectsItemContext } from '../../../hooks/projectsItem';
import { useQueryContext } from '../../../pages/Query/queryContext';
import { saveQueryToStore } from '../../../utils/queryStorage';

interface QueryEditorProps {
  size?: Pick<AceEditorProps, 'width' | 'height'>;
}

export const QueryLayoutEditor = React.forwardRef(({ size }: QueryEditorProps, ref) => {
  const { projectId, project } = useProjectsItemContext();
  const { state: { query, isDisabled }, actions } = useQueryContext();
  const editor = createRef<AceEditorI>();

  const onKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (!isDisabled && event.code === 'Enter' && (event.altKey || event.ctrlKey || event.metaKey)) {
      actions.run();
    }
  }, [actions.run]);

  React.useEffect(() => {
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [onKeyDown]);

  const saveQuery = React.useCallback(debounce(100, (q: string) => {
    saveQueryToStore(projectId, q);
  }), [projectId]);

  const focusAce = React.useCallback(() => {
    editor.current?.editor.focus();
  }, [editor]);

  React.useLayoutEffect(() => {
    saveQuery(query);
  }, [query]);

  React.useEffect(() => () => {
    saveQuery.cancel();
    editor.current?.editor.clearSelection();
  }, [projectId]);

  React.useImperativeHandle(ref, () => ({
    focus: focusAce,
  }));

  const tryFocusEditor = React.useCallback(() => {
    const noFocusedEl = !window.document.activeElement || window.document.activeElement.tagName === 'BODY';
    const noSelectedText = !window.document.getSelection()?.toString();

    if (noFocusedEl && noSelectedText) {
      focusAce();
    }
  }, [focusAce]);

  React.useEffect(() => {
    window.addEventListener('click', tryFocusEditor);

    return () => {
      window.removeEventListener('click', tryFocusEditor);
    };
  }, [tryFocusEditor]);

  return (
    <AceEditor
      ref={editor}
      name="query_editor"
      mode={project?.pg_version === 14 ? 'pgsql14' : 'pgsql15'}
      theme="crimson_editor"
      width={size?.width || '100%'}
      height={size?.height || '100%'}
      value={query}
      onChange={actions.onChangeQuery}
      onSelectionChange={() => {
        if (editor.current) {
          actions.onChangeQuerySelection(editor.current.editor.getSelectedText());
        }
      }}
      style={{
        height: '100%',
        width: '100%',
        ...size,
      }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        tabSize: 2,
        showLineNumbers: true,
        showPrintMargin: false,
        fontSize: 14,
      }}
      focus
    />
  );
});

QueryLayoutEditor.displayName = 'QueryLayoutEditor';
