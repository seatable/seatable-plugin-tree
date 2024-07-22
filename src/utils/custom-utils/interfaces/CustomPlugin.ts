import { IPluginDataStore } from '@/utils/template-utils/interfaces/App.interface';
import { PresetsArray, ResizeDetail } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';
import { SelectOption } from '@/utils/template-utils/interfaces/PluginSettings.interface';
import { TableArray, TableColumn } from '@/utils/template-utils/interfaces/Table.interface';

export interface IPluginTLProps {
  allTables: TableArray;
  levelSelections: ILevelSelections;
  pluginDataStore: IPluginDataStore;
  activePresetId: string;
  resetDataValue: { t: string; c: number };
  isDevelopment: boolean | undefined;
  pluginPresets: PresetsArray;
  activePresetIdx: number;
  updatePresets: (
    currentIdx: number,
    presets: PresetsArray,
    _pluginDataStore: IPluginDataStore,
    id: string
  ) => void;
}

export interface ILevelSelections {
  first: LevelSelection;
  second: LevelSelection;
  third?: LevelSelection;
}

export interface LevelSelection {
  selected: SelectOption;
  isDisabled: boolean;
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
  uniqueId: string;
  nextLevelRows?: levelRowInfo[];
  secondLevelRows?: levelRowInfo[];
  thirdLevelRows?: levelRowInfo[];
}
export interface HeaderRowProps {
  columns: TableColumn[] | undefined;
  level: number;
  tableName?: string;
  levelSelections: ILevelSelections;
  columnWidths: ResizeDetail[];
  setColumnWidths: React.Dispatch<React.SetStateAction<ResizeDetail[]>>;
  updateResizeDetails: (resize_details: ResizeDetail[]) => void;
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
  columnWidths: ResizeDetail[];
  setColumnWidths: React.Dispatch<React.SetStateAction<ResizeDetail[]>>;
  updateResizeDetails: (resize_details: ResizeDetail[]) => void;
}

export type levelsStructureInfo = levelRowInfo[];

export interface RowExpandedInfo {
  ['0000']: string | number | any[];
  _id: string;
  expanded: boolean;
  uniqueId: string;
  secondLevelRows?: RowExpandedInfo[];
  thirdLevelRows?: RowExpandedInfo[];
  [key: string]: any;
}

export interface IResizableCell {
  children: React.ReactNode;
  onHover: boolean;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, col_id: string, col_name: string) => void;
}
