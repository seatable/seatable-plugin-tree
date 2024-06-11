import { levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { Table, TableColumn, TableView } from '../Table.interface';
import { ICollaborator } from './Collaborator.interface';

export interface IFormatterProps {
    displayColumnName: boolean;
    type?: string;
    column: TableColumn;
    selectedView?: TableView;
    row?: levelRowInfo;
    table?: Table;
    collaborators: ICollaborator[];
    getLinkCellValue: (linkId: string, table1Id: string, table2Id: string, rowId: string) => void;
    getRowsByID: (tableId: string, rowIds: string[]) => void;
    getTableById: (table_id: string) => void;
    getUserCommonInfo: any;
    getMediaUrl: () => void;
    formulaRows: any;
}