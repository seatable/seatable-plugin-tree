import { ILevelSelections } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { SettingsOption } from '../../types';
import { AppActiveState, IActiveComponents, IPluginDataStore } from './App.interface';
import { PresetSettings, PresetsArray } from './PluginPresets/Presets.interface';
import { Table, TableArray, TableViewArray } from './Table.interface';

interface IPluginSettingsProps {
  allTables: TableArray;
  columnsCount: number;
  appActiveState: AppActiveState;
  activeTableViews: TableViewArray;
  pluginPresets: PresetsArray;
  onTableOrViewChange: (type: SettingsOption, option: SelectOption, table: Table) => void;
  onToggleSettings: () => void;
  isShowSettings: boolean;
  activeComponents: IActiveComponents;
  pluginDataStore: IPluginDataStore;
  // onLevelSelectionChange: (levelSelections: ILevelSelections) => void;
  activeLevelSelections: ILevelSelections;
  setActiveLevelSelections:  React.Dispatch<React.SetStateAction<ILevelSelections>>;
  updatePresets: (
    currentIdx: number,
    presets: PresetsArray,
    _pluginDataStore: IPluginDataStore,
    id: string
  ) => void;
}

interface SelectOption {
  value: string; // item._id
  label: string; // item.name
}

interface IActivePresetSettings extends PresetSettings {
  activePresetId: string;
}
type FileExtension =
  | 'md'
  | 'txt'
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'odt'
  | 'fodt'
  | 'ppt'
  | 'pptx'
  | 'odp'
  | 'fodp'
  | 'xls'
  | 'xlsx'
  | 'ods'
  | 'fods'
  | 'mp4'
  | 'ogv'
  | 'webm'
  | 'mov'
  | 'flv'
  | 'wmv'
  | 'rmvb'
  | 'mp3'
  | 'oga'
  | 'ogg'
  | 'flac'
  | 'aac'
  | 'ac3'
  | 'wma'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'svg'
  | 'gif'
  | 'bmp'
  | 'ico'
  | 'folder'
  | 'default';

type FileIconMap = {
  [key in FileExtension]: string;
};

export type { IPluginSettingsProps, SelectOption, IActivePresetSettings, FileIconMap };
