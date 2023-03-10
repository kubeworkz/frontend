import React, { createRef } from 'react';
import { useConfirmation } from '#shared/components/Confirmation/ConfirmationProvider';
import { AdminProject, AdminGetProjectsParams, internalApiService } from '#api_client/internal';
import { Text } from '#shared/components/Text/Text';
import { generatePath, Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import { DateTimeFormat, formatDate } from '#shared/utils/formatDate';
import { mbAsGB } from '#shared/utils/sizeHelpers';
import { ActionsDropdown } from '#shared/components/ActionsDropdown/ActionsDropdown';
import { ActionsDropdownItem } from '#shared/components/ActionsDropdown/ActionDropdownItem/ActionsDropdownItem';
import { toast } from 'react-toastify';
import { ToastSuccess } from '#shared/components/Toast/Toast';
import { apiErrorToaster } from '#api_client/utils';
import { humanReadableBytes } from '#shared/utils/units';
import { UserLink } from '../UserLink/UserLink';
import { PageserverLink } from '../PageserverLink/PageserverLink';
import { SafekeeperLink } from '../SafekeeperLink/SafekeeperLink';
import { AdminRoutes } from '../../config/routes';
import { DataPage, DataPageRef } from '../DataPage/DataPage';
import { ProjectsItemFormModal } from '../ProjectsItemForm/ProjectsItemFormModal';
import { ProjectListFilters } from './ProjectListFilters';

export const ProjectsList = () => {
  const { confirm } = useConfirmation();

  const [editingProject, setEditingProject] = React.useState<AdminProject | null>(null);

  const onRequestCloseEditProject = React.useCallback(() => setEditingProject(null), []);

  const dataPageRef = createRef<DataPageRef>();

  const getProjects = React.useCallback(
    (options: AdminGetProjectsParams) => (
      internalApiService
        .adminGetProjects(options)
        .then(({ data }) => (data))
    ),
    [],
  );

  const checkAvailibility = React.useCallback((projectId: string) => (
    internalApiService.adminCheckProjectAvailibility(projectId).then(({ data }) => (
      toast(<ToastSuccess body={`Successfully started check availability with ${data.operations.length} ops`} />)
    ))
      .catch(apiErrorToaster)
  ), []);

  const reattachProject = React.useCallback((projectId: string) => (
    confirm({
      text: 'Are you sure you want to reattach? This can cause in-progress queries to fail, and performance issues until everything gets warmed up again.',
    }).then(() => {
      internalApiService.adminProjectReattach(projectId).then(() => (
        toast(<ToastSuccess body="Successfully started reattach operation" />)
      ))
        .catch(apiErrorToaster);
    })
  ), []);

  const cols = React.useMemo(() => ([
    {
      label: 'Id',
      key: 'id',
      sortable: true,
      renderValue: (c: AdminProject, search: string[]) => (
        <Text
          as={Link}
          to={generatePath(AdminRoutes.ProjectsItem, { projectId: c.id.toString() })}
        >
          <Highlighter
            textToHighlight={c.id.toString()}
            searchWords={search}
          />
        </Text>
      ),
    },
    {
      label: 'Name',
      key: 'name',
      renderValue: (c: AdminProject) => (
        <Text appearance="secondary">{c.name}</Text>
      ),
    },
    {
      label: 'Created at',
      key: 'created_at',
      renderValue: (c: AdminProject) => (
        <Text appearance="secondary">{formatDate(c.created_at, DateTimeFormat.AdminDefault)}</Text>
      ),
      sortable: true,
    },
    {
      label: 'Updated at',
      key: 'updated_at',
      renderValue: (c: AdminProject) => (
        <Text appearance="secondary">{formatDate(c.updated_at, DateTimeFormat.AdminDefault)}</Text>
      ),
    },
    {
      label: 'Storage size',
      key: 'synthetic_storage_size',
      renderValue: (c: AdminProject) => (
        <Text nowrap>
          {c.synthetic_storage_size ? `${humanReadableBytes(c.synthetic_storage_size)}` : '?'}
        </Text>
      ),
      sortable: true,
    },
    {
      label: 'Resident size',
      key: 'resident_size',
      renderValue: (c: AdminProject) => (
        <Text nowrap>
          {c.resident_size ? `${humanReadableBytes(c.resident_size)}` : '?'}
        </Text>
      ),
      sortable: true,
    },
    {
      label: 'Max size',
      key: 'max_project_size',
      renderValue: (c: AdminProject) => (
        <Text nowrap>
          {c.max_project_size ? mbAsGB(c.max_project_size) : 'unknown'}
          {' '}
          GB
        </Text>
      ),
    },
    {
      label: 'Tenant',
      key: 'tenant_id',
      renderValue: (c: AdminProject) => (
        <Text
          style={{
            maxWidth: '80px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={c.tenant}
        >
          {c.tenant}
        </Text>
      ),
    },
    {
      label: 'User id',
      key: 'user_id',
      sortable: true,
      renderValue: (c: AdminProject) => (
        c.user_id
        && (
          <UserLink id={c.user_id}>
            <Text
              as={Link}
              to={generatePath(AdminRoutes.UsersItem, { userId: c.user_id.toString() })}
            >
              {c.user_id.substring(0, 8)}
            </Text>
          </UserLink>
        )
      ),
    },
    {
      label: 'Pageserver id',
      key: 'pageserver_id',
      sortable: true,
      renderValue: (c: AdminProject) => (
        c.pageserver_id
        && (
          <PageserverLink id={c.pageserver_id as number}>
            <Text
              as={Link}
              to={generatePath(
                AdminRoutes.PageserversItem,
                { pageserverId: c.pageserver_id.toString() },
              )}
            >
              {c.pageserver_id}
            </Text>
          </PageserverLink>
        )
      ),
    },
    {
      label: 'Safekeepers',
      key: 'safekeepers',
      renderValue: ({ safekeepers }: AdminProject) => {
        if (!safekeepers || !safekeepers.length) {
          return null;
        }

        return (
          <>
            {safekeepers.map((safekeeper, index) => (
              <React.Fragment key={`safekeeper_${safekeeper.id}`}>
                <SafekeeperLink id={safekeeper.id}>
                  <Text
                    as={Link}
                    to={generatePath(
                      AdminRoutes.SafekeepersItem,
                      { safekeeperId: safekeeper.id.toString() },
                    )}
                  >
                    {safekeeper.id}
                  </Text>
                </SafekeeperLink>
                {index < safekeepers.length - 1 && ', '}
              </React.Fragment>
            ))}
          </>
        );
      },
    },
    {
      label: '',
      key: 'actions',
      renderValue: (c: AdminProject) => (
        <Text
          as={Link}
          to={`${AdminRoutes.OperationsList}?project_id=${c.id}`}
        >
          operations
        </Text>
      ),
    },
    {
      label: '',
      key: 'row_actions',
      renderValue: (c: AdminProject) => (
        <ActionsDropdown>
          <ActionsDropdownItem
            as="button"
            onClick={() => setEditingProject(c)}
          >
            change max size
          </ActionsDropdownItem>
          <ActionsDropdownItem
            as="button"
            onClick={() => checkAvailibility(c.id)}
          >
            check availibility
          </ActionsDropdownItem>
          <ActionsDropdownItem
            as="button"
            onClick={() => reattachProject(c.id)}
          >
            reattach pageserver
          </ActionsDropdownItem>
        </ActionsDropdown>
      ),
    },
  ]), []);

  return (
    <>
      {editingProject
      && (
        <ProjectsItemFormModal
          project={editingProject}
          onDecline={onRequestCloseEditProject}
          onSubmit={() => {
            onRequestCloseEditProject();
            dataPageRef.current?.fetch();
          }}
        />
      )}
      <DataPage
        title="Projects"
        get={getProjects}
        tableProps={{
          cols,
        }}
        filtersComponent={ProjectListFilters}
        defaultSort={{
          sort: 'created_at',
          order: 'desc',
        }}
        ref={dataPageRef}
      />
    </>
  );
};
