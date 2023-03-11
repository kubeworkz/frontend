import { DataTableColumnRenderer } from '../../components/DataTable/DataTable';

export const createActionsCol = <DataItemType>(
  renderer: DataTableColumnRenderer<DataItemType>,
) => ({
    key: 'actions',
    renderValue: renderer,
    tdAttrs: {
      style: { width: '0' },
    },
  });
