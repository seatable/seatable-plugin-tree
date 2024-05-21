import { AppActiveState, IPluginDataStore } from '@/utils/template-utils/interfaces/App.interface';
import { PresetsArray } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';
import { TableArray, TableRow } from '@/utils/template-utils/interfaces/Table.interface';

export interface IPluginTLProps {
  pluginPresets: PresetsArray;
  allTables: TableArray;
  appActiveState: AppActiveState;
  pluginDataStore: IPluginDataStore;
  activeViewRows?: TableRow[];
}
