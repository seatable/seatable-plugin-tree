import pluginContext from '../../plugin-context';
import dayjs from 'dayjs';
import icon from '../../plugin-config/icon.png';
import { AppActiveState, IPluginDataStore } from './interfaces/App.interface';
import { PresetSettings, PresetsArray } from './interfaces/PluginPresets/Presets.interface';
import {
  AssetOptions,
  IActiveTableAndView,
  Table,
  TableArray,
  TableRow,
  TableView,
} from './interfaces/Table.interface';
import {
  DEFAULT_PLUGIN_DATA,
  FILEEXT_ICON_MAP,
  PLUGIN_NAME,
  POSSIBLE,
  PresetHandleAction,
} from './constants';
import { IFile } from './interfaces/Formatter/File.interface';
import { FileIconMap } from './interfaces/PluginSettings.interface';

export const getFileIconUrl = (filename: string, direntType: string): string => {
  if (typeof direntType === 'string' && direntType === 'dir') {
    return 'assets/folder/' + FILEEXT_ICON_MAP['folder'];
  }

  const identifierIndex = typeof filename === 'string' ? filename.lastIndexOf('.') : -1;
  if (identifierIndex === -1) {
    return 'assets/file/192/' + FILEEXT_ICON_MAP['default'];
  }

  const file_ext =
    (typeof filename === 'string' && filename.slice(identifierIndex + 1).toLowerCase()) ||
    'default';

  const iconUrl =
    file_ext in FILEEXT_ICON_MAP
      ? 'assets/file/192/' + FILEEXT_ICON_MAP[file_ext as keyof FileIconMap]
      : 'assets/file/192/' + FILEEXT_ICON_MAP['default'];

  return iconUrl;
};

export const generateImageSrc = (
  imageName: string,
  server: string,
  pluginName: string,
  isDevelopment: boolean | undefined
): string => {
  if (isDevelopment || !server) {
    return icon;
  }
  return `${server}/dtable-plugins/${pluginName}/?path=/media/${imageName}`;
};

export const downloadFile = (url: string, fileName: string) => {
  const token = pluginContext.getSetting('accessToken');
  fetch(url, { headers: new Headers({ Authorization: `Bearer ${token}` }) })
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    })
    .catch((e) => console.error('download error:', e));
};

export const downloadFiles = (downloadUrlList: string[]): void => {
  const downloadFrame = document.getElementById('downloadFrame');
  if (downloadFrame != null) {
    document.body.removeChild(downloadFrame);
  }
  downloadUrlList.forEach((url: string, index: number) => {
    const path = url;
    const timer1 = setTimeout(
      (function (path) {
        return function () {
          const iframe = document.createElement('iframe');
          iframe.setAttribute('id', 'downloadFrame');
          iframe.style.display = 'none';
          iframe.src = path;
          document.body.appendChild(iframe);
          const timer2 = setTimeout(function () {
            iframe.remove();
            clearTimeout(timer2);
          }, 5000);
          clearTimeout(timer1);
        };
      })(path),
      1000 * index
    );
  });
};

export const bytesToSize = (bytes: number | undefined): string => {
  if (typeof bytes === 'undefined') return ' ';
  if (bytes < 0) return '--';

  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes === 0) return '0 ' + sizes[0];

  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return (bytes / Math.pow(1000, i)).toFixed(1) + ' ' + sizes[i];
};

const isInternalUrl = (url: string) => {
  if (!url || typeof url !== 'string') return false;
  const server = getServer();
  return url.indexOf(server) > -1;
};

export const getImageThumbnailUrl = (url: string, size = 256) => {
  if (!url || typeof url !== 'string') return '';
  const server = getServer();
  const workspaceID = getWorkspaceID();
  const dtableUuid = getDtableUuid();
  if (isCustomAssetUrl(url)) {
    const assetUuid = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return (
      server + '/dtable/' + dtableUuid + '/custom-asset-thumbnail/' + assetUuid + '?size=' + size
    );
  }
  if (isDigitalSignsUrl(url)) {
    return generateCurrentBaseImageThumbnailUrl({
      server,
      workspaceID,
      dtableUuid,
      size,
      partUrl: url,
    });
  }
  if (checkSVGImage(url) || !isInternalUrl(url)) {
    return url;
  }
  return url.replace('/workspace', '/thumbnail/workspace') + '?size=' + size;
};

export const getFileThumbnailUrl = (file: IFile) => {
  const { type: fileType, name: fileName, url: fileUrl } = file;
  if (!fileName) return FILEEXT_ICON_MAP['default'];
  const isImage = imageCheck(fileName);
  let fileIconUrl;
  if (isSeafileConnectorUrl(fileUrl) || isCustomAssetUrl(fileUrl)) {
    fileIconUrl = getFileIconUrl(fileName, fileType);
  } else if (isImage) {
    fileIconUrl = getImageThumbnailUrl(fileUrl);
  } else {
    fileIconUrl = getFileIconUrl(fileName, fileType);
  }
  return fileIconUrl;
};

export const imageCheck = (filename: string) => {
  // no file ext
  if (!filename || typeof filename !== 'string') return false;
  if (filename.lastIndexOf('.') === -1) {
    return false;
  }
  const file_ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
  const image_exts = ['gif', 'jpeg', 'jpg', 'png', 'ico', 'bmp', 'tif', 'tiff'];
  return image_exts.includes(file_ext);
};

export const assetUrlAddParams = (url: string, options: AssetOptions) => {
  if (typeof url !== 'string') {
    return '';
  }
  const { page, column, row, block, otherColumn, otherRow } = options;
  let { pageId, columnKey, rowId, blockId, otherColumnKey, otherRowId } = options;
  if (!pageId && page) {
    pageId = page.id;
  }
  if (!columnKey && column) {
    columnKey = column.key;
  }
  if (!rowId && row) {
    rowId = row._id;
  }
  if (!blockId && block) {
    blockId = block.id;
  }
  let params = `page_id=${pageId}&column_key=${columnKey}&row_id=${rowId}`;
  if (!otherColumnKey && otherColumn) {
    otherColumnKey = otherColumn.key;
  }
  if (!otherRowId && otherRow) {
    otherRowId = otherRow._id;
  }
  if (otherColumnKey && otherRowId) {
    params = `${params}&other_column_key=${otherColumnKey}&other_row_id=${otherRowId}`;
  }
  return url.indexOf('?') === -1 ? `${url}?${params}` : `${url}&${params}`;
};

export const generatorBase64Code = (keyLength = 4) => {
  let key = '';
  for (let i = 0; i < keyLength; i++) {
    key += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));
  }
  return key;
};

export const generatorPresetId = (presets: Array<{ _id: string }>): string => {
  let preset_id = '',
    isUnique = false;

  const isIdUnique = (id: string): boolean => {
    return presets?.every((item) => {
      return item._id !== id;
    });
  };

  while (!isUnique) {
    preset_id = generatorBase64Code(4);
    isUnique = isIdUnique(preset_id);

    if (isUnique) {
      break;
    }
  }

  return preset_id;
};

export const isValidEmail = (email: string): boolean => {
  const reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,6}$/;

  return reg.test(email);
};

export const generateCurrentBaseImageUrl = (op: {
  partUrl: string;
  server: string;
  workspaceID: string;
  dtableUuid: string;
}) => {
  if (!op.partUrl || typeof op.partUrl !== 'string') return '';
  return `${op.server}/workspace/${op.workspaceID}/asset/${op.dtableUuid}${op.partUrl}`;
};

export const isInternalURL = (url: string) => {
  if (!url || typeof url !== 'string') return false;
  return url.indexOf(window.dtable.server) > -1;
};

export const isDigitalSignsUrl = (url: string) => {
  if (!url || typeof url !== 'string') return false;
  return isTargetUrl('/digital-signs/', url) && !url.includes('http');
};

export const calculateColumns = (
  galleryColumnsName: string[],
  currentColumns: { name: string }[]
): { name: string }[] => {
  const newColumns: { name: string }[] = [];
  galleryColumnsName.forEach((columnName) => {
    const column = currentColumns.find((column) => columnName === column.name);
    if (column) {
      newColumns.push(column);
    }
  });
  return newColumns;
};

export const calculateColumnsName = (
  currentColumns: { name: string }[],
  galleryColumnsName: string[] | undefined
): string[] => {
  let newColumnsName: string[] = [];
  currentColumns.forEach((column) => {
    newColumnsName.push(column.name);
  });
  if (galleryColumnsName) {
    const columnsName: string[] = Array.from(new Set([...galleryColumnsName, ...newColumnsName]));
    newColumnsName = columnsName.filter((columnName) =>
      newColumnsName.some((c) => c === columnName)
    );
  }
  return newColumnsName;
};

export const checkDesktop = () => {
  return window.innerWidth >= 768;
};

export const isTableEditable = (
  {
    permission_type = 'default',
    permitted_users = [],
  }: { permission_type?: string; permitted_users?: string[] },
  TABLE_PERMISSION_TYPE: {
    DEFAULT: string;
    ADMINS: string;
    SPECIFIC_USERS: string;
  }
): boolean => {
  const { isAdmin, username } = window.dtable ? window.dtable : window.dtablePluginConfig;

  if (!permission_type) {
    return true;
  }
  if (permission_type === TABLE_PERMISSION_TYPE.DEFAULT) {
    return true;
  }
  if (permission_type === TABLE_PERMISSION_TYPE.ADMINS && isAdmin) {
    return true;
  }
  if (
    permission_type === TABLE_PERMISSION_TYPE.SPECIFIC_USERS &&
    permitted_users.includes(username)
  ) {
    return true;
  }
  return false;
};

export const canCreateRows = (
  table: {
    table_permissions?: {
      add_rows_permission?: {
        permission_type?: string;
        permitted_users?: string[];
      };
    };
  },
  TABLE_PERMISSION_TYPE: {
    DEFAULT: string;
    ADMINS: string;
    SPECIFIC_USERS: string;
  }
): boolean => {
  let canCreateRows = true;
  if (table && table.table_permissions && table.table_permissions.add_rows_permission) {
    canCreateRows = isTableEditable(
      table.table_permissions.add_rows_permission,
      TABLE_PERMISSION_TYPE
    );
  }
  return canCreateRows;
};

export const needUseThumbnailImage = (url: string): string | boolean => {
  if (!url || url.lastIndexOf('.') === -1) {
    return false;
  }
  const image_suffix = url.substr(url.lastIndexOf('.') + 1).toLowerCase();
  const suffix = ['bmp', 'tif', 'tiff'];
  return suffix.includes(image_suffix);
};

export const isInternalImg = (url: string): boolean | undefined => {
  if (!url) return;
  return url.indexOf(window.dtable.server) > -1;
};

export const checkSVGImage = (url: string): boolean | undefined => {
  if (!url) return false;
  return url.substr(-4).toLowerCase() === '.svg';
};

export const getFileUploadTime = (fileItem: { upload_time?: string | number }) => {
  return fileItem.upload_time ? dayjs(fileItem.upload_time).format('YYYY-MM-DD HH:mm') : '';
};

export const isTargetUrl = (target: string, url: string) => {
  if (!url || typeof url !== 'string') return false;
  return target && url ? url.indexOf(target) > -1 : false;
};

export const isCustomAssetUrl = (url: string) => {
  return isTargetUrl('custom-asset://', url);
};

export const truncateTableName = (tableName: string) => {
  let _tableName;

  if (tableName.split('').length > 22) {
    _tableName = tableName.slice(0, 20) + '...';

    return _tableName;
  }

  return tableName;
};

/**
 * Checks whether a preset name already exists in the presets array, excluding the current index.
 *
 * @param {string} presetName - The name of the preset to check for existence.
 * @param {PresetsArray} presets - An array of presets to search for duplicates.
 * @param {number} currentIndex - The index of the preset to exclude from the check.
 * @returns {boolean} - Returns true if the preset name already exists, excluding the current index.
 */
export const isUniquePresetName = (
  presetName: string,
  presets: PresetsArray,
  currentIndex: number
): boolean => {
  // Using the `some` method to check if any preset (excluding the current index) has the same name
  return presets.some((preset, index) => index !== currentIndex && preset.name === presetName);
};

export const appendPresetSuffix = (name: string, nameList: string[], suffix: string): string => {
  if (!nameList.includes(name.trim())) {
    return name;
  } else {
    const _name = `${name} ${suffix}`;
    return appendPresetSuffix(_name, nameList, suffix);
  }
};

/**
 * The function has the purpose of getting the plugin data
 * If the plugin presets are not found, it maps inside the activeTable and returns set it as value.
 * @param {string} PLUGIN_NAME The name of the plugin.
 * @param {Table} activeTable A Table object needed in the .
 * @returns An array with the plugin's presets
 */
// export const getPluginSettings = (activeTable: Table) => {
// Function implementation...
// };
export const getPluginDataStore = (activeTable: Table, PLUGIN_NAME: string) => {
  // Retrieving the Plugin Data as the IPluginDataStore
  const getPluginDataStore: IPluginDataStore = window.dtableSDK.getPluginSettings(PLUGIN_NAME); // getPluginSettings = getPluginDataStore

  return getPluginDataStore === null || getPluginDataStore.presets.length === 0
    ? createDefaultPluginDataStore(activeTable, PLUGIN_NAME)
    : getPluginDataStore;
};

/**
 * Parses plugin data to create the active state for the application.
 *
 * @param {IPluginDataStore} pluginDataStore - The data store containing plugin-related information.
 * @param {PresetsArray} pluginPresets - An array of presets used by the plugin.
 * @param {TableArray} allTables - An array containing all available tables in the application.
 */
export const parsePluginDataToActiveState = (
  pluginDataStore: IPluginDataStore,
  pluginPresets: PresetsArray,
  allTables: TableArray
) => {
  // Extract relevant data from the pluginDataStore and allTables arrays
  const id = localStorage.getItem('localActivePresetId') || pluginPresets[0]._id;
  const idx =
    pluginPresets.findIndex((p) => p._id === id) === -1
      ? 0
      : pluginPresets.findIndex((p) => p._id === id);

  console.log({ id, idx, pluginPresets });

  const table =
    allTables.find((t) => t._id === pluginPresets[idx].settings?.selectedTable?.value) ||
    allTables[0];
  const tableName = table.name;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tableView = table.views.find(
    (v) => v._id === pluginPresets[idx].settings?.selectedView?.value
  )!;

  // Create the appActiveState object with the extracted data
  const appActiveState = {
    activePresetId: id,
    activePresetIdx: idx,
    activeTable: table,
    activeTableName: tableName,
    activeTableView: tableView,
  };

  // Return the active state object
  return appActiveState;
};

/**
 * Safeguard function to determine the active state, considering the presence of presets.
 * If no presets are available, the first Table and View are set as the active ones.
 *
 * @param {PresetsArray} pluginPresets - An array of presets used by the plugin.
 * @param {Table} activeTable - The currently active table in the application.
 * @param {object} activeTableAndView - The active table and view as an object containing {table: Table, view: TableView}.
 * @param {TableRow[]} activeViewRows - An array of rows for the active view.
 */
export const getActiveStateSafeGuard = (
  pluginPresets: PresetsArray,
  activeTable: Table,
  activeTableAndView: {
    table: Table;
    view: TableView;
  },
  activeViewRows: TableRow[]
) => {
  // Create the checkForPresets object with the active state based on presets or default values
  const checkForPresets: AppActiveState = {
    activeTable: (pluginPresets[0] && (activeTableAndView?.table as Table)) || activeTable,
    activeTableName:
      (pluginPresets[0] && pluginPresets[0].settings?.selectedTable?.label) || activeTable.name,
    activeTableView:
      (pluginPresets[0] && (activeTableAndView?.view as TableView)) || activeTable.views[0],
    activePresetId: (pluginPresets[0] && pluginPresets[0]._id) || '0000', // '0000' as Safe guard if there are no presets
    activePresetIdx: 0,
    activeViewRows: activeViewRows,
  };

  // Return the active state object considering presets or default values
  return checkForPresets;
};

/**
 * Retrieves the active table and view based on the preset handling action type.
 *
 * @param pluginPresets - Array of plugin presets.
 * @param allTables - Array of all available tables.
 * @param type - Type of preset handling action (e.g., new, duplicate).
 * @param option - Additional options for handling presets (e.g., preset ID, preset settings).
 * @returns An object containing the active table and view.
 */
export const getActiveTableAndActiveView = (
  pluginPresets: PresetsArray,
  allTables: TableArray,
  type?: string,
  option?: { pId: string; pSettings: PresetSettings }
) => {
  let table;
  let views;
  let view;

  // Type === 'new' we set the first Table and View as the active ones
  // Type === 'duplicate' we set the selected Table and View as the active ones
  // Type === undefined we set the last used Table and View as the active ones (TO-DO)
  if (type === PresetHandleAction.new) {
    table = allTables[0];
    view = table?.views[0];
  } else if (type === PresetHandleAction.duplicate) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    table = allTables.find((i) => i.name === option?.pSettings.selectedTable?.label)!;
    views = table?.views;
    // eslint-disable-next-line
    view = views?.find((v) => {
      return v.name === option?.pSettings.selectedView?.label;
    })!;
  } else if (pluginPresets.length > 0 && type === undefined) {
    // This needs to be changes since in this case we need to retrieve the Last Preset used from the USER
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    table = allTables.find((i) => i.name === pluginPresets[0].settings?.selectedTable?.label)!;
    views = table?.views;
    // eslint-disable-next-line
    view = views?.find((v) => {
      return v.name === pluginPresets[0].settings?.selectedView?.label;
    })!;
  }

  return {
    table: table,
    view: view,
  } as IActiveTableAndView;
};

/**
 * Creates a default preset for the plugin.
 * @param activeTable - The active table for which it retrieves the info.
 * @param pluginName - The name of the plugin associated with the preset.
 * @returns The default preset with initial settings.
 */
export const createDefaultPluginDataStore = (
  activeTable: Table,
  pluginName: string
): IPluginDataStore => {
  // This is a safe guard to prevent the plugin from crashing if there are no presets
  const _presetSettings: PresetSettings = {
    selectedTable: { value: activeTable._id, label: activeTable.name },
    selectedView: { value: activeTable.views[0]._id, label: activeTable.views[0].name },
  };

  // Importing the default settings from the constants file and updating the presets array with the Default Settings
  const updatedDefaultDataStore = {
    ...DEFAULT_PLUGIN_DATA,
    [PLUGIN_NAME]: pluginName,
    presets: [
      {
        ...DEFAULT_PLUGIN_DATA.presets[0],
        settings: _presetSettings,
      },
    ],
  };
  window.dtableSDK.updatePluginSettings(pluginName, updatedDefaultDataStore);
  return updatedDefaultDataStore;
};

/**
 * Creates default preset settings based on the provided array of tables.
 *
 * @param {TableArray} allTables - An array containing all available tables in the application.
 * @returns {object} defaultPresetSettings - Default settings for a preset.
 */
export const createDefaultPresetSettings = (allTables: TableArray) => {
  // Extract information for the default table and view
  const tableInfo = { value: allTables[0]._id, label: allTables[0].name };
  const viewInfo = { value: allTables[0].views[0]._id, label: allTables[0].views[0].name };

  // Create and return the default preset settings object
  return {
    shown_image_name: 'Image',
    shown_title_name: 'Title',
    selectedTable: tableInfo,
    selectedView: viewInfo,
  };
};
export const createDefaultPresetCustomSettings = (allTables: TableArray) => {
  // Extract information for the default table and view
  const tableInfo = { value: allTables[0]._id, label: allTables[0].name };
  const viewInfo = { value: allTables[0].views[0]._id, label: allTables[0].views[0].name };

  // Create and return the default preset settings object
  return {
    shown_image_name: 'Image',
    shown_title_name: 'Title',
    selectedTable: tableInfo,
    selectedView: viewInfo,
  };
};

export const findPresetName = (presets: PresetsArray, presetId: string) => {
  return presets.find((preset) => preset._id === presetId)?.name;
};

export const isMobile = () => {
  return window.innerWidth <= 800;
};

export const getServer = () => {
  return pluginContext && pluginContext.getSetting('server');
};

export const getMediaUrl = () => {
  return pluginContext && pluginContext.getSetting('mediaUrl');
};

export const getWorkspaceID = () => {
  return pluginContext && pluginContext.getSetting('workspaceID');
};

export const getDtableUuid = () => {
  return pluginContext && pluginContext.getSetting('dtableUuid');
};

const isSeafileConnectorUrl = (url: string) => {
  return isTargetUrl('seafile-connector://', url);
};

const generateCurrentBaseImageThumbnailUrl = ({
  server,
  workspaceID,
  dtableUuid,
  partUrl,
  size,
}: {
  server: string;
  workspaceID: string;
  dtableUuid: string;
  partUrl: string;
  size: number;
}) => {
  if (!partUrl || typeof partUrl !== 'string') return '';
  return `${server}/thumbnail/workspace/${workspaceID}/asset/${dtableUuid}${partUrl}?size=${size}`;
};
