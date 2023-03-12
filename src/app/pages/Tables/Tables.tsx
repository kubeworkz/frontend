import { PageError } from '../../../components/PageError/PageError';
import { CenteredLoader } from '../../../components/Loader/Loader';
import { useBranches } from '../../../hooks/projectBranches';
import axios from 'axios';
import { createErrorText } from '../../../api/utils';
import { TablesControls } from '../../../components/Tables/TablesControls';
import { TablesColumns } from '../../../components/Tables/TablesColumns';
import { TablesTitleBar } from '../../../components/Tables/TablesTitle';

import { TablesResult } from '../../../components/Tables/TablesResult';
import { TablesPagination } from '../../../components/Tables/TablesPagination';
import { BranchCreateButton } from '../../../components/CreateButton/BranchCreateButton/BranchCreateButton';
import { TablesProvider, useTables } from './tablesContext';
import styles from './Tables.module.css';

const TablesViewOrError = () => {
  const { branches, isLoading } = useBranches();
  const { error } = useTables();

  if (isLoading) {
    // todo: add skeleton when design is ready
    return <CenteredLoader />;
  }

  return branches.length === 0 ? (
    <PageError
      title="You don’t have any branches yet"
      actions={(
        <BranchCreateButton size="l">
          Create first branch
        </BranchCreateButton>
      )}
    />
  ) : (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <TablesControls />
        <TablesColumns />
      </div>
      <div className={styles.main}>
        {error ? (
          <PageError
            title={axios.isAxiosError(error) ? createErrorText(error) : 'Something went wrong'}
          />
        )
          : (
            <>

              <TablesTitleBar />
              <TablesResult />
              <TablesPagination />
            </>
          )}
      </div>
    </div>
  );
};

export const Tables = () => (
  <TablesProvider>
    <TablesViewOrError />
  </TablesProvider>
);
