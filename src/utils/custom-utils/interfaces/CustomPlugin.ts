import { IPluginDataStore } from '@/utils/template-utils/interfaces/App.interface';
import { SelectOption } from '@/utils/template-utils/interfaces/PluginSettings.interface';
import { TableArray, TableColumn } from '@/utils/template-utils/interfaces/Table.interface';

export interface IPluginTLProps {
  allTables: TableArray;
  pluginDataStore: IPluginDataStore;
  levelSelections: ILevelSelections;
}

export interface PresetCustomSettings {
  [key: string]: any;
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
  columns: TableColumn[];
  nextLevelRows?: levelRowInfo[];
  secondLevelRows?: levelRowInfo[];
  thirdLevelRows?: levelRowInfo[];
}
export interface HeaderRowProps {
  columns: TableColumn[] | undefined;
  tableName?: string;
}

export type levelsStructureInfo = levelRowInfo[];
