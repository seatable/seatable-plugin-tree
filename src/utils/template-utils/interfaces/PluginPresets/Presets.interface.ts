import { ILevelSelections, RowExpandedInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
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
    id: string
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
  customSettings?: ILevelSelections;
  expandedRows?: RowExpandedInfo[];
}

export interface PresetSettings {
  shown_image_name?: string | undefined;
  shown_title_name?: string | undefined;
  selectedTable?: SelectOption;
  selectedView?: SelectOption;
  resize_details?: ResizeDetail[];
}

export interface ResizeDetail {
  id: string;
  width: number;
}

export type PresetsArray = IPresetInfo[];
