import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { InviteCreateRequest, internalApiService } from '../../api/internal';
import { apiErrorToaster } from '../../api/utils';
import { DataTableProps } from '../../components/DataTable/DataTable';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Text } from '../../components/Text/Text';
import { CopyButton } from '../../components/CopyButton/CopyButton';
import { DateTimeFormat, formatDate } from '../../utils/formatDate';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { ModalHeader } from '../../components/Modal/ModalHeader';
import { ModalBody } from '../../components/Modal/ModalBody';
import { ModalActions } from '../../components/Modal/ModalActions';
import { Form } from '../../components/Form/Form';
import { useDataFilters } from '../../components/DataFilters/hooks';
import { DataFilters } from '../../components/DataFilters/DataFilters';

import { AdminDataTable } from '../AdminDataTable/AdminDataTable';
import { NewInvite } from './NewInvite';

const initialValues: InviteCreateRequest = {
  prefix: 'welcome-to-cloudrock',
  how_many_invites: 1,
  total_registrations: 1,
};

interface Invite {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
}

const FILTERS = {
  code: 'contains',
  total: '>=',
  used: '>=',
} as const;

interface InvitesListProps
  extends DataTableProps<Invite> {}

export const InvitesList = (props: InvitesListProps) => {
  const [showNewInvite, setShowNewInvite] = useState(false);

  const form = useForm<InviteCreateRequest>({ defaultValues: initialValues });
  const onAdd = useCallback((data: InviteCreateRequest) => {
    internalApiService.adminInviteCreate(data)
      .then(() => window.location.reload())
      .catch(apiErrorToaster);
  }, []);

  const [filters, setFilters] = useState({ code: '', total: 0, used: 0 });

  const filtered = useDataFilters(props.data ?? [], filters, FILTERS);

  return (
    <>
      <PageHeader
        header={(
          <>
            <span>Invites</span>
            &nbsp;&nbsp;
            <Button
              appearance="default"
              icon="add_14"
              onClick={() => setShowNewInvite(true)}
            />
          </>
        )}
      />
      <DataFilters
        filters={FILTERS}
        values={filters}
        onChange={setFilters}
      />
      <br />
      <AdminDataTable
        {...props}
        data={filtered}
        cols={[
          {
            label: 'Id',
            key: 'id',
            sortable: true,
          },
          {
            label: 'Code',
            key: 'code',
            renderValue: (data) => (
              <div style={{
                display: 'flex',
                alignItems: 'center',
              }}
              >
                <span style={{ marginRight: '8px' }}>
                  <CopyButton title="Copy the sign in link" text={`${window.location.origin}/?invite=${data.code}`} />
                </span>
                {data.code}
              </div>
            ),
          },
          {
            label: 'Total',
            key: 'total',
          },
          {
            label: 'Used',
            key: 'used',
          },
          {
            label: 'Created at',
            key: 'created_at',
            renderValue: (data) => (
              <Text appearance="secondary" nowrap>{formatDate(data.created_at, DateTimeFormat.AdminDefault)}</Text>
            ),
          },
        ]}
      />
      <Modal isOpen={showNewInvite} onRequestClose={() => setShowNewInvite(false)}>
        <FormProvider {...form}>
          <ModalHeader>New invite</ModalHeader>
          <ModalBody>
            <Form id="new-invite-form" onSubmit={form.handleSubmit(onAdd)}>
              <NewInvite />
            </Form>
          </ModalBody>
          <ModalActions>
            <Button type="submit" form="new-invite-form">OK</Button>
          </ModalActions>
        </FormProvider>
      </Modal>
    </>
  );
};
