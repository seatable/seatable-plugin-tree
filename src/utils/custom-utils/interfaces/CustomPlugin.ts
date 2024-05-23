import { AppActiveState, IPluginDataStore } from '@/utils/template-utils/interfaces/App.interface';
import { PresetsArray } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';
import { SelectOption } from '@/utils/template-utils/interfaces/PluginSettings.interface';
import {
  TableArray,
  TableColumn,
  TableRow,
} from '@/utils/template-utils/interfaces/Table.interface';

export interface IPluginTLProps {
  pluginPresets: PresetsArray;
  allTables: TableArray;
  appActiveState: AppActiveState;
  pluginDataStore: IPluginDataStore;
  activeViewRows?: TableRow[];
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
  // level: CustomSettingsOption;
  selected: SelectOption;
  rows: TableRow[];
  columns: TableColumn[];
}
