/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TableColumn, TableRow } from '@/utils/template-utils/interfaces/Table.interface';
import React from 'react';
import { CellType, getNumberDisplayString, getDateDisplayString } from 'dtable-utils';
import {
  FormatterLink,
  ILinkProps,
} from '@/utils/template-utils/interfaces/Formatter/Link.interface';
import { levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import styles from '../../../../styles/template-styles/formatter/LinkFormatter.module.scss';

const LinkFormatter: React.FC<ILinkProps> = ({ column, row, linkMetaData }) => {
  let linkID: string;

  const links: FormatterLink[] = window.dtableSDK.getLinks();
  const getLinkedCellValue = (row: levelRowInfo) => {
    if (!row) return [];

    const { link_id } = column.data || {};
    linkID = link_id;
    const link = links.find((link: FormatterLink) => link._id === linkID);

    if (!link || (!link.table1_table2_map && !link.table2_table1_map)) {
      return [];
    }

    const ids = link.table1_table2_map?.[row._id] || link.table2_table1_map?.[row._id];

    return ids || [];
  };

  const rowIds = getLinkedCellValue(row);

  const getDisplayValue = (row: TableRow, displayColumnKey: string) => {
    const value = row[displayColumnKey];
    const { array_type: type, array_data: data } = column.data;

    switch (type) {
      case CellType.NUMBER: {
        return getNumberDisplayString(value, data);
      }
      case CellType.DATE: {
        const { format } = data;
        return getDateDisplayString(value, format);
        // return value;
      }
      case CellType.SINGLE_SELECT: {
        const option = data.options.find((item: any) => item.id === value || item.name === value);
        return option ? option.name : null;
      }
      default:
        return value;
    }
  };

  const getDisplayValues = () => {
    if (rowIds && Array.isArray(rowIds) && rowIds.length > 0) {
      const { display_column_key: displayColumnKey } = column.data;

      let linkedTable = linkMetaData.getLinkedTable(column.data.table_id);
      const linkedColumn: TableColumn | undefined = linkedTable.columns.find(
        (column: TableColumn) => column.key === displayColumnKey
      );

      if (!linkedColumn) {
        return null;
      }

      const { type, data } = linkedColumn;

      if (data && type === CellType.SINGLE_SELECT) {
        linkedTable = linkMetaData.getLinkedTable(column.data.other_table_id);
      }

      const linkedRows = linkMetaData.getLinkedRows(column.data.table_id, rowIds)[0]
        ? linkMetaData.getLinkedRows(column.data.table_id, rowIds)
        : linkMetaData.getLinkedRows(column.data.other_table_id, rowIds);
      const result = linkedRows.map((row: TableRow, index: number) => {
        const displayValue = getDisplayValue(row, displayColumnKey);
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
