import { capitalize } from 'lodash';
import React, { useCallback } from 'react';

import { Invoice } from '../../api/publicv2';
import { useCurrentUser } from '../../hooks/currentUser';
import {
  DataTable,
  DataTableColumn,
} from '../../components/DataTable/DataTable';
import { CardNext } from '../../components/CardNext/CardNext';
import { Button } from '../../components/Button/Button';
import { Loader } from '../../components/Loader/Loader';

import { DateTimeFormat, formatDate } from '../../utils/formatDate';
import { useBilling } from '../../app/pages/Billing/context';
import styles from './Billing.module.css';

const invoicesColumns: DataTableColumn<Invoice>[] = [
  {
    label: 'No.',
    key: 'id',
    renderValue: (invoice) => (
      <Button
        appearance="default"
        as="a"
        href={invoice.hosted_invoice_url}
        target="_blank"
      >
        {invoice.invoice_number}
      </Button>
    ),
  },
  {
    label: 'Issued',
    key: 'issued',
    renderValue: (invoice) => formatDate(invoice.issued_at, DateTimeFormat.Date),
  },
  {
    label: 'Due date',
    key: 'dueDate',
    renderValue: (invoice) => formatDate(invoice.due_date ?? '', DateTimeFormat.Date),
  },
  {
    label: 'Status',
    key: 'status',
    renderValue: (invoice) => capitalize(invoice.status)
      + (invoice.status === 'paid' && invoice.paid_at
        ? ` on ${formatDate(invoice.paid_at, DateTimeFormat.Date)}`
        : ''),
  },
  {
    label: 'Total invoiced',
    key: 'totalInvoiced',
    renderValue: (invoice) => `${invoice.total} ${invoice.currency}`,
  },
  {
    label: 'PDF',
    key: 'pdf',
    tdAttrs: {
      className: styles.pdfColumn,
    },
    renderValue: (invoice) => (
      <Button
        icon="download_20"
        appearance="default"
        as="a"
        href={invoice.pdf_url}
        target="_blank"
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
        }}
      />
    ),
  },
];

export const Billing = () => {
  const { user } = useCurrentUser();
  const { invoices, consumptionPeriods, isLoading } = useBilling();

  const usage = consumptionPeriods[consumptionPeriods.length - 1];
  const humanReadableCost = useCallback(
    (amount: number) => `${amount}$`,
    [usage],
  );

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.headerBlock}>
        <h2 className={styles.headerText}>Current month-to-date</h2>
      </div>
      <div className={styles.consumptionBlock}>
        {usage === undefined ? (
          <div className={styles.consumptionEmpty}>
            No consumption data available
          </div>
        ) : (
          <>
            <CardNext
              appearance="primary"
              icon="full-bill_20"
              header="Total cost"
            >
              <div className={styles.consumptionCardTotal}>
                {humanReadableCost(usage.cost_total)}
              </div>
            </CardNext>
            <CardNext
              icon="compute_20"
              header="Compute time"
            >
              <div className={styles.consumptionCardValue}>
                {humanReadableCost(usage.compute_time_cost)}
              </div>
              <div className={styles.consumptionCardSub} />
            </CardNext>
            <CardNext
              icon="storage-disk_20"
              header="Project storage"
            >
              <div className={styles.consumptionCardValue}>
                {humanReadableCost(usage.data_storage_cost)}
              </div>
              <div className={styles.consumptionCardSub} />
            </CardNext>
            <CardNext
              icon="written-data_20"
              header="Written data"
            >
              <div className={styles.consumptionCardValue}>
                {humanReadableCost(usage.written_data_cost)}
              </div>
              <div className={styles.consumptionCardSub} />
            </CardNext>
            <CardNext
              icon="data-transfer_20"
              header="Data transfer"
            >
              <div className={styles.consumptionCardValue}>
                {humanReadableCost(usage.data_transfer_cost)}
              </div>
              <div className={styles.consumptionCardSub} />
            </CardNext>
          </>
        )}
      </div>
      <div className={styles.middleBlock}>
        <div className={styles.middleBlockItem}>
          <div className={styles.middleBlockItemHeader}>Billing email</div>
          <div className={styles.middleBlockCard}>
            <div className={styles.billingEmail}>{user.email}</div>
          </div>
        </div>
        {user.billingAccount.payment_source.card && (
          <div className={styles.middleBlockItem}>
            <div className={styles.middleBlockItemHeader}>Payment method</div>
            <div className={styles.middleBlockCard}>
              <div className={styles.billingCard}>
                **
                {user.billingAccount.payment_source.card.last4}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.invoicesBlock}>
        <div className={styles.invoicesBlockHeader}>Latest invoices</div>
        <DataTable data={invoices} cols={invoicesColumns} />
      </div>
    </div>
  );
};
