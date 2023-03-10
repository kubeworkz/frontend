/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { FormLabel } from '#shared/components/Form/FormLabel/FormLabel';
import { BranchSelectOption, useBranches } from '#shared/hooks/projectBranches';
import classnames from 'classnames';
import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import { useQueryContext } from '../../../pages/Query/queryContext';
import { DatabaseSelect } from '../../DatabaseSelect/DatabaseSelect';
import { QuerySaveButton } from '../QuerySaveButton/QuerySaveButton';
import { BranchSelect } from '../../BranchSelect/BranchSelect';
import styles from './QueryLayoutHeader.module.css';

export const QueryLayoutHeader = () => {
  const {
    state: {
      database, selectedQueryName, queryChanged, branch,
    },
    actions: { onChangeDatabase, onChangeBranch: setBranch },
  } = useQueryContext();
  const { selectOptionsById } = useBranches();

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <div
          className={classnames(styles.title, {
            [styles.notSaved]: selectedQueryName && queryChanged,
          })}
        >
          {selectedQueryName || 'Untitled'}
        </div>
        <div className={styles.controls}>
          <QuerySaveButton />
        </div>
      </div>
      <div className={styles.opts}>
        <div className={styles.optField}>
          <FormLabel htmlFor="branch" title="Branch"><SvgIcon name="tree_20" /></FormLabel>
          <BranchSelect
            id="branch"
            size="s"
            value={branch && selectOptionsById[branch.id]}
            onChange={(opt: BranchSelectOption) => opt && setBranch(opt.branch)}
            className={styles.dbSelect}
            disableBranchesWithoutEndpoints
          />
        </div>
        <div className={styles.optField}>
          <FormLabel htmlFor="database" title="Database"><SvgIcon name="database_20" /></FormLabel>
          <DatabaseSelect
            id="database"
            size="s"
            className={styles.dbSelect}
            value={database}
            onChange={onChangeDatabase}
          />
        </div>
      </div>
    </div>
  );
};
