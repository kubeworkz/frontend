/* eslint global-require: 0, import/no-dynamic-require: 0 */

import { AceEditorProps } from 'react-ace/types';
import Mustache from 'mustache';
import { CONN_DATA_PLACEHOLDER } from '#shared/utils/connectionString';
import React, { useMemo } from 'react';
import { HighlightedCodeBlock } from '../Code/Code';

export enum SnippetType {
  Psql = 'psql',
  NextJS = 'nextjs',
  PrismaJS = 'prismajs',
  Ruby = 'ruby',
  Hasura = 'hasura',
  Django = 'django',
  Java = 'java',
  SQLAlchemy = 'sql_alchemy',
  NodeJS = 'nodejs',
  Symfony = 'symfony',
  Go = 'go',
}

export const SnippetsOrder: SnippetType[] = [
  SnippetType.Psql,
  SnippetType.NextJS,
  SnippetType.PrismaJS,
  SnippetType.NodeJS,
  // SnippetType.Ruby,
  // SnippetType.Hasura,
  SnippetType.Django,
  SnippetType.SQLAlchemy,
  SnippetType.Java,
  SnippetType.Symfony,
  SnippetType.Go,
];

export const SnippetTypeLabels: Record<SnippetType, string> = {
  [SnippetType.Psql]: 'psql',
  [SnippetType.NextJS]: 'next.js',
  [SnippetType.PrismaJS]: 'prisma.js',
  [SnippetType.Ruby]: 'ruby',
  [SnippetType.Hasura]: 'hasura',
  [SnippetType.Django]: 'Django',
  [SnippetType.Java]: 'Java',
  [SnippetType.SQLAlchemy]: 'SQLAlchemy',
  [SnippetType.NodeJS]: 'NodeJS',
  [SnippetType.Symfony]: 'Symfony',
  [SnippetType.Go]: 'Go',
};

export const SnippetTypeLanguage: Record<SnippetType, AceEditorProps['mode']> = {
  [SnippetType.NextJS]: 'javascript',
  [SnippetType.Ruby]: 'ruby',
  [SnippetType.PrismaJS]: 'prisma',
  [SnippetType.Psql]: 'nix',
  [SnippetType.Hasura]: 'hasura',
  [SnippetType.Django]: 'python',
  [SnippetType.Java]: 'java',
  [SnippetType.SQLAlchemy]: 'python',
  [SnippetType.NodeJS]: 'javascript',
  [SnippetType.Symfony]: 'nix',
  [SnippetType.Go]: 'golang',
};

export const SNIPPET_TYPE_OPTIONS = SnippetsOrder.map((key) => ({
  value: key,
  label: SnippetTypeLabels[key],
}));

export interface SnippetConnectionData {
  role?: string;
  database?: string;
  projectName: string;
  password?: string;
  host: string;
}

const CONN_STRING_PARTIAL = {
  connstring: require('./snippets/_connstring.mustache').trim(),
};

const TEMPLATES = Object.fromEntries(Object.values(SnippetType).map((type) => [
  type,
  require(`./snippets/${type}.mustache`).trim(),
]));

export const renderSnippetContent = (
  type: SnippetType,
  connectionData: SnippetConnectionData,
) => Mustache.render(TEMPLATES[type], {
  ...CONN_DATA_PLACEHOLDER,
  ...connectionData,
  passwordOrPlaceholder: connectionData.password || CONN_DATA_PLACEHOLDER.password,
}, CONN_STRING_PARTIAL);

export type SnippetProps = {
  type: SnippetType;
  connectionData: SnippetConnectionData;
  onCopy: () => void;
};
export const Snippet = ({
  type,
  connectionData,
  onCopy,
}: SnippetProps) => {
  const snippet = useMemo(() => renderSnippetContent(type, connectionData), [type, connectionData]);

  return (
    <HighlightedCodeBlock
      onCopy={onCopy}
      mode={SnippetTypeLanguage[type]}
    >
      {snippet}
    </HighlightedCodeBlock>
  );
};
