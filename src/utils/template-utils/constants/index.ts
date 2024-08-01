// External imports
import info from '../../../plugin-config/info.json';
// Interfaces
import { PresetSettings } from '../../template-utils/interfaces/PluginPresets/Presets.interface';
import { AppActiveState, AppIsShowState } from '../../template-utils/interfaces/App.interface';
import {
  FileIconMap,
  IActivePresetSettings,
} from '../../template-utils/interfaces/PluginSettings.interface';

// Constants
const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';

const PLUGIN_NAME = info.name
  .replace(/-([a-z])/g, (_, match) => ' ' + match.toUpperCase())
  .replace(/^./, (str) => str.toUpperCase());
const PLUGIN_ID = `${info.name}-component`;

// Table and Preset Defaults
const TABLE_NAME = 'table_name';
const DEFAULT_PRESET_NAME = 'Default Preset';

// Default Select Option
const DEFAULT_SELECT_OPTION = {
  value: '',
  label: '',
};

// Default Preset Settings
const DEFAULT_PRESET_SETTINGS: PresetSettings = {
  shown_image_name: '',
  shown_title_name: '',
  selectedTable: DEFAULT_SELECT_OPTION,
  selectedView: DEFAULT_SELECT_OPTION,
};

// Default Plugin Data
const DEFAULT_PLUGIN_DATA = {
  pluginName: PLUGIN_NAME,
  activePresetId: '0000',
  activePresetIdx: 0,
  presets: [
    {
      _id: '0000',
      name: DEFAULT_PRESET_NAME,
      settings: DEFAULT_PRESET_SETTINGS,
    },
  ],
};

// Preset Handle Actions
const PresetHandleAction = {
  delete: 'delete',
  rename: 'rename',
  duplicate: 'duplicate',
  edit: 'edit',
  new: 'new',
};

// KeyDown Actions
const KeyDownActions = {
  enter: 'Enter',
  escape: 'Escape',
};

// Initial App State
const INITIAL_IS_SHOW_STATE: AppIsShowState = {
  isShowPlugin: true,
  isShowSettings: false,
  isLoading: true,
  isShowPresets: true,
};

const INITIAL_CURRENT_STATE: AppActiveState = {
  activeTable: null,
  activeTableName: 'Table1',
  activeTableView: null,
  activePresetId: '0000',
  activePresetIdx: 0,
};

// Default Selected Preset
const DEFAULT_SELECTED_PRESET: IActivePresetSettings = {
  activePresetId: '',
  selectedTable: DEFAULT_SELECT_OPTION,
  selectedView: DEFAULT_SELECT_OPTION,
};

const PREVIEWER = 'previewer';
const ADDITION = 'addition';

const FILEEXT_ICON_MAP: FileIconMap = {
  // text file
  md: 'txt.png',
  txt: 'txt.png',

  // pdf file
  pdf: 'pdf.png',

  // document file
  doc: 'word.png',
  docx: 'word.png',
  odt: 'word.png',
  fodt: 'word.png',

  ppt: 'ppt.png',
  pptx: 'ppt.png',
  odp: 'ppt.png',
  fodp: 'ppt.png',

  xls: 'excel.png',
  xlsx: 'excel.png',
  ods: 'excel.png',
  fods: 'excel.png',

  // video
  mp4: 'video.png',
  ogv: 'video.png',
  webm: 'video.png',
  mov: 'video.png',
  flv: 'video.png',
  wmv: 'video.png',
  rmvb: 'video.png',

  // music file
  mp3: 'music.png',
  oga: 'music.png',
  ogg: 'music.png',
  flac: 'music.png',
  aac: 'music.png',
  ac3: 'music.png',
  wma: 'music.png',

  // image file
  jpg: 'pic.png',
  jpeg: 'pic.png',
  png: 'pic.png',
  svg: 'pic.png',
  gif: 'pic.png',
  bmp: 'pic.png',
  ico: 'pic.png',

  // folder dir
  folder: 'folder-192.png',

  // default
  default: 'file.png',
};

// Exported Constants
export {
  POSSIBLE,
  PLUGIN_NAME,
  PLUGIN_ID,
  TABLE_NAME,
  DEFAULT_PLUGIN_DATA,
  DEFAULT_PRESET_NAME,
  DEFAULT_PRESET_SETTINGS,
  PresetHandleAction,
  KeyDownActions,
  INITIAL_IS_SHOW_STATE,
  INITIAL_CURRENT_STATE,
  DEFAULT_SELECTED_PRESET,
  DEFAULT_SELECT_OPTION,
  FILEEXT_ICON_MAP,
  PREVIEWER,
  ADDITION,
};
