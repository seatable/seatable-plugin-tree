import { levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { TableColumn } from '../Table.interface';

export interface IMetaData {
  expandLinkedTableRow: (row: levelRowInfo, tableId: string) => any;
  getLinkedCellValue: (linkId: string, table1Id: string, table2Id: string, row_id: string) => any;
  getLinkedRows: (tableId: string, rowIds: string[]) => any;
  getLinkedTable: (tableId: string) => any;
}

export interface ILinkProps {
  column: TableColumn;
  row: levelRowInfo;
  currentTableId: string;
  linkMetaData: IMetaData;
  containerClassName: string;
}

interface TableMap {
  [key: string]: string[];
}
export interface FormatterLink {
  _id: string;
  table1_id: string;
  table1_table2_map: TableMap;
  table2_id: string;
  table2_table1_map: TableMap;
}
