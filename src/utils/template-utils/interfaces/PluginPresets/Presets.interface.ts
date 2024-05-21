import { PLUGIN_NAME } from '../../../constants';
import { AppActiveState, IPluginDataStore } from '../App.interface';
import { SelectOption } from '../PluginSettings.interface';
import { TableArray } from '../Table.interface';

export interface IPresetsProps {
  pluginPresets: PresetsArray;
  activePresetIdx: number;
  onSelectPreset: (presetId: string, newPresetActiveState?: AppActiveState) => void;
  updatePresets: (
    currentIdx: number,
    presets: PresetsArray,
    _pluginDataStore: IPluginDataStore,
    type: string
  ) => void;
  pluginDataStore: IPluginDataStore;
  isShowPresets: boolean;
  allTables: TableArray;
  onTogglePresets: () => void;
  onToggleSettings: () => void;
  updateActiveData: () => void;
}

export interface IPresetsState {
  dragItemIndex: number | null;
  dragOverItemIndex: number | null;
  _allViews: any[];
}

export interface IPresetInfo {
  _id: string;
  name: string;
  settings?: PresetSettings;
}

export interface PresetSettings {
  shown_image_name?: string | undefined;
  shown_title_name?: string | undefined;
  selectedTable?: SelectOption;
  selectedView?: SelectOption;
}

export type PresetsArray = IPresetInfo[];
