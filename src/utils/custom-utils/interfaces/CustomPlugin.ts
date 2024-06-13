import { IPluginDataStore } from '@/utils/template-utils/interfaces/App.interface';
import { SelectOption } from '@/utils/template-utils/interfaces/PluginSettings.interface';
import { TableArray, TableColumn } from '@/utils/template-utils/interfaces/Table.interface';

export interface IPluginTLProps {
  allTables: TableArray;
  levelSelections: ILevelSelections;
  pluginDataStore: IPluginDataStore;
  activePresetId: string;
  resetDataValue: { t: string; c: number };
  isDevelopment: boolean | undefined;
}

export interface ILevelSelections {
  first: LevelSelection;
  second: LevelSelection;
  third?: LevelSelection;
}

export interface LevelSelection {
  selected: SelectOption;
}

export interface levelRowInfo {
  _name: string;
  _id: string;
  _participants: any[];
  _creator: string;
  _ctime: string;
  _last_modifier: string;
  _mtime: string;
  '0000': string;
  expanded: boolean;
  columns: TableColumn[];
  nextLevelRows?: levelRowInfo[];
  secondLevelRows?: levelRowInfo[];
  thirdLevelRows?: levelRowInfo[];
}
export interface HeaderRowProps {
  columns: TableColumn[] | undefined;
  tableName?: string;
}

export interface ExpandableItemProps {
  item: levelRowInfo;
  allTables: TableArray;
  levelSelections: ILevelSelections;
  expandedRowsInfo: RowExpandedInfo[];
  level: number;
  handleItemClick: (updatedRow: RowExpandedInfo) => void;
  expandedHasChanged: boolean;
  rowsEmptyArray: boolean;
  isDevelopment: boolean | undefined;
}

export type levelsStructureInfo = levelRowInfo[];

export interface RowExpandedInfo {
  ['0000']: string | number | any[];
  _id: string;
  expanded: boolean;
  secondLevelRows?: RowExpandedInfo[];
  thirdLevelRows?: RowExpandedInfo[];
  [key: string]: any;
}
