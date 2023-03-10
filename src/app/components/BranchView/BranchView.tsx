import React, { useState } from 'react';
import { generatePath } from 'react-router-dom';

import { Button } from '#shared/components/Button/Button';
import { useGoBack } from '#shared/hooks/useGoBack';
import { ConsoleRoutes } from '#shared/routes';
import { IconButton } from '#shared/components/Button/IconButton/IconButton';
import { DateTimeFormat, formatDate } from '#shared/utils/formatDate';
import { DataTableHeader } from '#shared/components/DataTable/DataTableHeader/DataTableHeader';
import {
  ConfirmationPreset,
  createConfirmation,
  useConfirmation,
} from '#shared/components/Confirmation/ConfirmationProvider';
import { apiService } from '#api_client/publicv2';
import { apiErrorToaster } from '#api_client/utils';
import { Skeleton } from '#shared/components/Skeleton/Skeleton';
import { renderDataSize } from '#shared/utils/branch';
import { Text } from '#shared/components/Text/Text';
import { CopyButton } from '#shared/components/CopyButton/CopyButton';
import { useBranches } from '#shared/hooks/projectBranches';

import {
  ModalForm,
  ModalFormActions,
  ModalFormBody,
  ModalFormCancelButton, ModalFormSubmitButton,
} from '#shared/components/Modal/ModalForm/ModalForm';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { BranchCreateButton } from '../CreateButton/BranchCreateButton/BranchCreateButton';
import { BranchRenameForm } from '../BranchRenameForm/BranchRenameForm';
import { BranchRenameFormFields } from '../BranchRenameForm/BranchRenameFormFields';
import { BranchViewEndpoints } from './BranchViewEndpoints/BranchViewEndpoints';
import {
  BranchViewBadge,
  BranchViewBadgeBody,
  BranchViewBadgeTable,
} from './BranchViewBadge/BranchViewBadge';
import styles from './BranchView.module.css';
import { BranchViewProps } from './types';

export const BranchView = ({
  branch, endpoints, onDeleteEndpoint, onDeleteBranch, onRenameBranch, onCreateEndpoint,
}: BranchViewProps) => {
  const { projectId, project } = useProjectsItemContext();
  const goBack = useGoBack(generatePath(ConsoleRoutes.ProjectsItemBranches, { projectId }));
  const { branchesById } = useBranches();
  const { confirm } = useConfirmation();
  const [isRenameFormVisible, setIsRenameFormVisible] = useState(false);

  const onClickDelete = React.useCallback(() => {
    confirm(createConfirmation(ConfirmationPreset.DeleteBranch, branch))
      .then(() => (
        apiService.deleteProjectBranch(branch.project_id, branch.id)
          .then(onDeleteBranch)
          .catch(apiErrorToaster)));
  }, [branch]);

  const databaseSize = React.useMemo(
    () => renderDataSize(branch, project),
    [branch, project],
  );

  return (
    <>
      <ModalForm
        title="Rename the branch"
        isOpen={isRenameFormVisible}
        onRequestClose={() => setIsRenameFormVisible(false)}
      >
        <BranchRenameForm
          branch={branch}
          onSuccess={() => {
            onRenameBranch();
            setIsRenameFormVisible(false);
          }}
        >
          <ModalFormBody>
            <BranchRenameFormFields />
          </ModalFormBody>
          <ModalFormActions>
            <ModalFormCancelButton />
            <ModalFormSubmitButton>
              Save
            </ModalFormSubmitButton>
          </ModalFormActions>
        </BranchRenameForm>
      </ModalForm>
      <div className={styles.root}>
        <div className={styles.header}>
          <IconButton
            className={styles.back}
            onClick={goBack}
            iconName="arrow-left_18"
          />
          <h1 className={styles.title}>
            {branch.name}
          </h1>
          <div className={styles.actions}>
            <Button
              onClick={onClickDelete}
              appearance="error"
              size="s"
            >
              Delete
            </Button>
            <Button
              onClick={() => setIsRenameFormVisible(true)}
              size="s"
            >
              Rename
            </Button>
            <BranchCreateButton
              parentId={branch.id}
              size="s"
            >
              Create branch
            </BranchCreateButton>
          </div>
        </div>
        <div className={styles.info}>
          {branch.parent_id && (
          <BranchViewBadge
            className={styles.info_parent}
            iconName="parent_12"
            title="Parent"
          >
            <BranchViewBadgeTable>
              <tr>
                <th>Branch</th>
                <td>{branchesById[branch.parent_id]?.name || branch.parent_id}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{branch.parent_timestamp ? formatDate(branch.parent_timestamp, DateTimeFormat.BranchDateFormat) : '-'}</td>
              </tr>
              <tr>
                <th>Time</th>
                <td>{branch.parent_timestamp ? formatDate(branch.parent_timestamp, DateTimeFormat.BranchTimeFormat) : '-'}</td>
              </tr>
              <tr>
                <th>LSN</th>
                <td>{branch.parent_lsn || '-'}</td>
              </tr>
            </BranchViewBadgeTable>
          </BranchViewBadge>
          )}
          <div className={styles.infoCol}>
            {databaseSize && (
            <BranchViewBadge
              title="Data size"
              iconName="database_12"
            >
              <BranchViewBadgeBody>
                <span className={styles.size}>
                  {databaseSize}
                </span>
              </BranchViewBadgeBody>
            </BranchViewBadge>
            )}
          </div>
          <div className={styles.infoCol}>
            <BranchViewBadge
              title="ID"
              iconName="id_12"
            >
              <BranchViewBadgeBody className={styles.badgeBodyId}>
                <Text appearance="primary" size="s">{branch.id}</Text>
                <CopyButton text={branch.id} />
              </BranchViewBadgeBody>
            </BranchViewBadge>
            <BranchViewBadge
              className={styles.info_created}
              title="Created"
              iconName="calendar_12"
            >
              <BranchViewBadgeBody className={styles.created}>
                {formatDate(branch.created_at)}
              </BranchViewBadgeBody>
            </BranchViewBadge>
          </div>
        </div>
        <DataTableHeader
          label="Compute endpoint"
        />
        <BranchViewEndpoints
          branchId={branch.id}
          endpoints={endpoints}
          onDeleteEndpoint={onDeleteEndpoint}
          onCreateEndpoint={onCreateEndpoint}
        />
      </div>
    </>
  );
};

export const BranchViewSkeleton = () => (
  <div className={styles.root}>
    <div className={styles.header}>
      <div className={styles.title}>
        <Skeleton width={80} height={36} />
      </div>
      <div className={styles.actions}>
        <Skeleton width={62} height={24} />
      </div>
    </div>
    <div className={styles.info}>
      <BranchViewBadge
        className={styles.info_parent}
        title="Parent"
      >
        <BranchViewBadgeTable>
          <tr>
            <th>Branch</th>
            <td><Skeleton width={60} height={10} /></td>
          </tr>
          <tr>
            <th>Date</th>
            <td><Skeleton width={60} height={10} /></td>
          </tr>
          <tr>
            <th>Time</th>
            <td><Skeleton width={60} height={10} /></td>
          </tr>
          <tr>
            <th>LSN</th>
            <td><Skeleton width={60} height={10} /></td>
          </tr>
        </BranchViewBadgeTable>
      </BranchViewBadge>
      <div className={styles.infoCol}>
        <BranchViewBadge
          title="Data size"
        >
          <BranchViewBadgeBody>
            <Skeleton width={20} height={20} />
          </BranchViewBadgeBody>
        </BranchViewBadge>
        <BranchViewBadge
          title="History size"
        >
          <BranchViewBadgeBody>
            <Skeleton width={20} height={20} />
          </BranchViewBadgeBody>
        </BranchViewBadge>
      </div>
      <BranchViewBadge
        title="ID"
      >
        <BranchViewBadgeBody className={styles.created}>
          <Skeleton width={80} height={10} />
        </BranchViewBadgeBody>
      </BranchViewBadge>
      <BranchViewBadge
        className={styles.info_created}
        title="Created"
      >
        <BranchViewBadgeBody className={styles.created}>
          <Skeleton width={80} height={10} />
        </BranchViewBadgeBody>
      </BranchViewBadge>
    </div>
    <DataTableHeader
      label="Compute endpoint"
    />
    <BranchViewEndpoints
      branchId=""
      endpoints={[]}
      isLoading
    />
  </div>
);
