/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Table, TableColumn, TableRow } from '@/utils/template-utils/interfaces/Table.interface';
import React from 'react';
import { CellType, getNumberDisplayString, getDateDisplayString } from 'dtable-utils';
import { ILinkProps } from '@/utils/template-utils/interfaces/Formatter/Link.interface';
import { levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import styles from '../../../../styles/template-styles/formatter/LinkFormatter.module.scss';

const LinkFormatter: React.FC<ILinkProps> = ({
  column,
  row,
  currentTableId,
  linkMetaData,
  containerClassName,
}) => {
  let linkID: string;
  const links = window.dtableSDK.getLinks();

  const getLinkedCellValue = (row: levelRowInfo) => {
    if (!row) return [];

    const { link_id } = column.data || {};
    linkID = link_id;
    const link = links.find((link: any) => link._id === linkID);

    const ids = link.table1_table2_map?.[row._id] || link.table2_table1_map?.[row._id];

    return ids;
  };

  const rowIds = getLinkedCellValue(row);

  const getDisplayValue = (linkedTable: Table, row: TableRow, displayColumnKey: string) => {
    const value = row[displayColumnKey];
    const linkedColumn: TableColumn = linkedTable.columns.find(
      (column) => column.key === displayColumnKey
    )!;
    const { type, data } = linkedColumn;

    switch (type) {
      case CellType.NUMBER: {
        return getNumberDisplayString(value, data);
      }
      case CellType.DATE: {
        const { format } = data;
        return getDateDisplayString(value, format);
      }
      default:
        return value;
    }
  };

  const getDisplayValues = () => {
    if (rowIds && Array.isArray(rowIds) && rowIds.length > 0) {
      const linkedTable =
        linkMetaData.getLinkedTable(column.data.table_id) ||
        linkMetaData.getLinkedTable(column.data.other_table_id);
      const linkedRows = linkMetaData.getLinkedRows(column.data.table_id, rowIds)[0]
        ? linkMetaData.getLinkedRows(column.data.table_id, rowIds)
        : linkMetaData.getLinkedRows(column.data.other_table_id, rowIds);
      const result = linkedRows.map((row: TableRow, index: number) => {
        const { display_column_key: displayColumnKey } = column.data;
        const displayValue = getDisplayValue(linkedTable, row, displayColumnKey);
        return (
          <div key={index} className={styles.linkFormatter_linkItem}>
            <div className={styles.linkFormatter_linkName}>{displayValue}</div>
          </div>
        );
      });
      return result;
    }
    return null;
  };

  return getDisplayValues();
};

export default LinkFormatter;
