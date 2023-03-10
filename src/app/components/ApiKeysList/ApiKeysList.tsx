import React from 'react';
import { ApiKeysListResponseItem, ApiKeyCreateResponse } from '#api_client/publicv2';

import { Button } from '#shared/components/Button/Button';
import classNames from 'classnames';
import { CopyButton } from '#shared/components/CopyButton/CopyButton';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { formatDate } from '#shared/utils/formatDate';
import styles from './ApiKeysList.module.css';

interface ApiKeysListProps {
  newKey?: ApiKeyCreateResponse;
  apiKeys?: ApiKeysListResponseItem[];
  onRevoke: (apiKeyId: number) => void;
}

interface ApiKeyItemCommonProps {
  id: number,
  onRevoke: (apiKeyId: number) => void;
  revealed?: boolean;
}

interface ApiKeyItemRevealedProps extends
  ApiKeyItemCommonProps {
  revealed: true;
  token: string;
}

interface ApiKeyItemUnrevealedProps extends
  ApiKeyItemCommonProps,
  ApiKeysListResponseItem {
  revealed: false;
  token?: never;
}

type ApiKeyListItemProps = ApiKeyItemRevealedProps | ApiKeyItemUnrevealedProps;

const ApiKeyListItem = (props: ApiKeyListItemProps) => (
  <li className={classNames(styles.item, {
    [`${styles.item_new}`]: props.revealed,
  })}
  >
    <div className={classNames(styles.col, styles.col_wide)}>
      {props.revealed
        ? (
          <div className={styles.new_token}>
            <div className={styles.ok}>
              <SvgIcon name="check-24" />
            </div>
            <span data-qa="api_key_created_value">
              {props.token}
            </span>
            <CopyButton
              className={styles.copy_button}
              text={props.token}
            />
          </div>
        ) : (
          <>
            <div className={styles.item_name}>
              {props.name}
            </div>
            <div className={styles.item_created}>
              Created
              {' '}
              {formatDate(props.created_at)}
            </div>
          </>
        )}
    </div>
    {!props.revealed
        && (
        <div className={styles.col}>
          <div className={styles.item_last_used}>
            Last used:
            {' '}
            {props.last_used_at ? formatDate(props.last_used_at) : 'never'}
          </div>
        </div>
        )}
    <div className={styles.col}>
      <Button
        size="s"
        appearance="error"
        onClick={() => props.onRevoke(props.id)}
      >
        Revoke
      </Button>
    </div>
  </li>
);

export const ApiKeysList = (props: ApiKeysListProps) => {
  if ((!props.apiKeys || !props.apiKeys.length) && !props.newKey) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {
        props.newKey
          && (
          <ApiKeyListItem
            id={props.newKey.id}
            token={props.newKey.key}
            onRevoke={props.onRevoke}
            revealed
          />
          )
      }
      {
        props.apiKeys?.map((apiKey) => {
          if (apiKey.id === props.newKey?.id) {
            return null;
          }

          return (
            <ApiKeyListItem
              key={apiKey.id}
              {...apiKey}
              revealed={false}
              onRevoke={props.onRevoke}
            />
          );
        })
      }
    </ul>
  );
};
