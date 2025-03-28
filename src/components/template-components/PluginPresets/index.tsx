import React, { useEffect, useState } from 'react';
import { getTableByName } from 'dtable-utils';
import PresetItem from './PresetItem/index';
import stylesPresets from 't_styles/PluginPresets.module.scss';
import deepCopy from 'deep-copy';
import Preset from 'model/preset';
import {
  IPresetInfo,
  IPresetsProps,
  PresetSettings,
  PresetsArray,
} from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';
import {
  appendPresetSuffix,
  createDefaultPresetSettings,
  generateImageSrc,
  generatorPresetId,
  getActiveTableAndActiveView,
  isUniquePresetName,
} from 'utils/template-utils/utils';
import {
  ACTIVE_PRESET_ID,
  DEFAULT_PLUGIN_DATA,
  PLUGIN_NAME,
  PresetHandleAction,
  TABLE_NAME,
} from 'utils/template-utils/constants';
import {
  IActiveTableAndView,
  TableArray,
  TableColumn,
} from '@/utils/template-utils/interfaces/Table.interface';
import PresetInput from './PresetInput';
import useClickOut from 'hooks/useClickOut';
import { AppActiveState } from '@/utils/template-utils/interfaces/App.interface';
import { HiOutlineChevronDoubleLeft } from 'react-icons/hi2';
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from 'locale';
import { levelSelectionDefaultFallback } from '../../../utils/custom-utils/utils';
import { ILevelSelections } from '@/utils/custom-utils/interfaces/CustomPlugin';
import pluginContext from '../../../plugin-context';
const { [DEFAULT_LOCALE]: d } = AVAILABLE_LOCALES;

const PluginPresets: React.FC<IPresetsProps> = ({
  allTables,
  pluginPresets,
  activePresetIdx,
  pluginDataStore,
  isShowPresets,
  isDevelopment,
  onTogglePresets,
  onToggleSettings,
  onSelectPreset,
  updatePresets,
  updateActiveData,
}) => {
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [presetName, setPresetName] = useState('');
  const [presetNameAlreadyExists, setPresetNameAlreadyExists] = useState(false);
  const [_pluginPresets, setPluginPresets] = useState<PresetsArray>([]);
  const [showNewPresetPopUp, setShowNewPresetPopUp] = useState<boolean>(false);
  const [showEditPresetPopUp, setShowEditPresetPopUp] = useState<boolean>(false);
  const server = pluginContext.getSetting('server');
  const icon = generateImageSrc('icon.png', server, PLUGIN_NAME.toLowerCase(), isDevelopment);

  useEffect(() => {
    setPluginPresets(pluginPresets);
  }, [pluginPresets]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSelectedTable = (tables: TableArray, settings: any = {}) => {
    const selectedTable = getTableByName(settings[TABLE_NAME]);
    if (!selectedTable) {
      return tables[0];
    }
    return selectedTable;
  };

  const initPresetSetting = (settings = {}) => {
    let initUpdated = {};
    const tables = window.dtableSDK.getTables();
    const selectedTable = getSelectedTable(tables, settings);
    const titleColumn = selectedTable.columns.find((column: TableColumn) => column.key === '0000');
    const imageColumn = selectedTable.columns.find(
      (column: TableColumn) => column.type === 'image'
    );
    const imageName = imageColumn ? imageColumn.name : null;
    const titleName = titleColumn ? titleColumn.name : null;
    initUpdated = Object.assign(
      {},
      { shown_image_name: imageName },
      { shown_title_name: titleName }
    );
    return initUpdated;
  };

  // handle preset name change
  const onChangePresetName = (e: React.FormEvent<HTMLInputElement>, type?: string) => {
    setPresetNameAlreadyExists(false);
    if (e.currentTarget.value.includes('  ')) {
      return;
    } else {
      setPresetName(e.currentTarget.value);
      onNewPresetSubmit(e, e.currentTarget.value, type);
    }
  };

  useClickOut(() => {
    setPresetNameAlreadyExists(false);
  });

  // Submit new/edited preset name
  const onNewPresetSubmit = (
    e: React.FormEvent<HTMLInputElement>,
    __presetName: string,
    type?: string
  ) => {
    let _presetName =
      __presetName.trim() ||
      presetName.trim() ||
      DEFAULT_PLUGIN_DATA.presets[0].name + ' ' + _pluginPresets.length;
    const _presetNames = _pluginPresets.map((p) => p.name);
    const isUnique = isUniquePresetName(_presetName, _pluginPresets, activePresetIdx);

    if (isUnique && type === PresetHandleAction.new) {
      _presetName = appendPresetSuffix(_presetName, _presetNames, 'new');
      setPresetNameAlreadyExists(false);
    } else if (isUnique) {
      setPresetNameAlreadyExists(true);
      return;
    }

    if (type === PresetHandleAction.edit) {
      editPreset(_presetName);
    } else {
      addPreset(type || PresetHandleAction.new, _presetName);
      setShowNewPresetPopUp(false);
    }

    setPresetName('');
    setShowEditPresetPopUp(type === PresetHandleAction.edit ? false : true);
  };

  // Toggle input field for add/edit preset
  const togglePresetsUpdate = (e?: React.MouseEvent<HTMLElement>, type?: string) => {
    if (type === PresetHandleAction.edit) {
      const presetName = pluginPresets[activePresetIdx]?.name;
      setPresetName(presetName);
      setShowEditPresetPopUp((prev) => !prev);
    } else {
      setPresetName('');
      setShowNewPresetPopUp((prev) => !prev);
    }
  };

  // add new/duplicate preset
  const addPreset = (
    type: string,
    presetName: string,
    option?: {
      pId: string;
      pSettings: PresetSettings;
      pCustomSettings: ILevelSelections | undefined;
    }
  ) => {
    const _presetSettings: PresetSettings =
      type === PresetHandleAction.new
        ? createDefaultPresetSettings(allTables)
        : type === PresetHandleAction.duplicate && option?.pSettings
          ? option.pSettings
          : {};

    setPluginPresets(_pluginPresets || []);
    const _activePresetIdx = _pluginPresets?.length;
    const _id: string = generatorPresetId(pluginPresets) || '';
    localStorage.setItem(ACTIVE_PRESET_ID, _id);
    const _presetCustomSettings =
      type === PresetHandleAction.new
        ? levelSelectionDefaultFallback(_pluginPresets, _id, allTables)
        : type === PresetHandleAction.duplicate && option?.pCustomSettings
          ? option.pCustomSettings
          : {};
    const newPreset = new Preset({ _id, name: presetName });
    const newPresetsArray = deepCopy(_pluginPresets);
    newPresetsArray.push(newPreset);
    const initUpdated = initPresetSetting();
    newPresetsArray[_activePresetIdx].settings = Object.assign(_presetSettings, initUpdated);
    newPresetsArray[_activePresetIdx].customSettings = Object.assign(_presetCustomSettings);
    pluginDataStore.presets = newPresetsArray;
    updatePresets(_activePresetIdx, newPresetsArray, pluginDataStore, _id);
    const _activeTableAndView: IActiveTableAndView = getActiveTableAndActiveView(
      newPresetsArray,
      allTables,
      type,
      option
    );

    // Update active state info
    const newPresetActiveState: AppActiveState = {
      activePresetId: _id,
      activePresetIdx: _activePresetIdx,
      activeTable: _activeTableAndView.table,
      // eslint-disable-next-line
      activeTableName: newPresetsArray[_activePresetIdx]?.settings?.selectedTable?.label!,
      activeTableView: _activeTableAndView.view,
    };
    onSelectPreset(_id, newPresetActiveState);
  };

  // Duplicate a preset
  const duplicatePreset = (p: IPresetInfo) => {
    const { name, _id, settings, customSettings } = p;
    if (settings) {
      const _presetNames = _pluginPresets.map((p) => p.name);
      const _presetName = appendPresetSuffix(name, _presetNames, 'copy');
      addPreset(PresetHandleAction.duplicate, _presetName, {
        pId: _id,
        pSettings: settings,
        pCustomSettings: customSettings,
      });
    }
  };

  // edit preset name
  const editPreset = (presetName: string) => {
    const newPluginPresets = deepCopy(pluginPresets);
    const oldPreset = pluginPresets[activePresetIdx];
    const _id: string = generatorPresetId(pluginPresets) || '';
    const updatedPreset = new Preset({ ...oldPreset, _id, name: presetName });
    localStorage.setItem(ACTIVE_PRESET_ID, _id);

    newPluginPresets.splice(activePresetIdx, 1, updatedPreset);
    pluginDataStore.presets = newPluginPresets;

    updatePresets(activePresetIdx, newPluginPresets, pluginDataStore, _id);
  };

  // Delete the selected Preset
  const deletePreset = () => {
    const newPluginPresets = deepCopy(pluginPresets);
    newPluginPresets.splice(activePresetIdx, 1);
    if (activePresetIdx >= newPluginPresets.length) {
      activePresetIdx = newPluginPresets.length - 1;
    }
    pluginDataStore.presets = newPluginPresets;
    localStorage.setItem(ACTIVE_PRESET_ID, newPluginPresets[0]._id);
    updatePresets(0, newPluginPresets, pluginDataStore, newPluginPresets[0]._id);
    updateActiveData();
  };

  // drag and drop logic
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setDragItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setDragOverItemIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, v_id: string) => {
    e.stopPropagation();
    e.preventDefault();

    const __pluginPresets = [...pluginPresets];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = __pluginPresets.splice(dragItemIndex, 1)[0];
      __pluginPresets.splice(dragOverItemIndex, 0, dragItem);
      setPluginPresets(__pluginPresets);
      setDragItemIndex(null);
      setDragOverItemIndex(null);
      const newIdx = __pluginPresets.findIndex((preset) => preset._id === v_id);
      const _pluginDataStore = { ...pluginDataStore, presets: __pluginPresets };

      updatePresets(newIdx, __pluginPresets, _pluginDataStore, v_id);
    }
  };
  return (
    <div
      className={`${stylesPresets.presets}  ${!isShowPresets && stylesPresets.presets_collapsed}`}>
      <button onClick={onTogglePresets} className={stylesPresets.presets_collapse_btn}>
        <HiOutlineChevronDoubleLeft />
      </button>
      <div className="d-flex flex-column">
        <div className={`d-flex align-items-center py-2 pb-4 ${stylesPresets.presets_logo}`}>
          <img src={icon} alt="Plugin Icon" className={stylesPresets.presets_icon} />
          <div className={stylesPresets.presets_name}>{PLUGIN_NAME}</div>
        </div>
        {pluginPresets?.map((preset, i) => (
          <div
            style={
              dragOverItemIndex === i && i === 0
                ? { borderTop: '2px solid #A9A9A9' }
                : dragOverItemIndex === i
                  ? { borderBottom: '2px solid #A9A9A9' }
                  : {}
            }
            key={preset._id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, i)}
            onDragEnter={(e) => handleDragEnter(e, i)}
            onDragEnd={(e) => handleDragEnd(e, preset._id)}
            onDragOver={handleDragOver}>
            <PresetItem
              p={preset}
              activePresetIdx={activePresetIdx}
              presetName={presetName}
              pluginPresets={pluginPresets}
              presetNameAlreadyExists={presetNameAlreadyExists && activePresetIdx === i}
              onChangePresetName={(e: React.FormEvent<HTMLInputElement>) =>
                onChangePresetName(e, PresetHandleAction.edit)
              }
              onSelectPreset={onSelectPreset}
              deletePreset={deletePreset}
              duplicatePreset={duplicatePreset}
              togglePresetsUpdate={togglePresetsUpdate}
              showEditPresetPopUp={showEditPresetPopUp}
              onToggleSettings={onToggleSettings}
            />
          </div>
        ))}
        {/* add new preset input  */}
        {showNewPresetPopUp && (
          <PresetInput
            onChangePresetName={(e: React.FormEvent<HTMLInputElement>) =>
              onChangePresetName(e, PresetHandleAction.new)
            }
            isEditing={showNewPresetPopUp}
            setIsEditing={setShowNewPresetPopUp}
            presetName={presetName}
          />
        )}
        {/* add new preset button  */}
        {!showNewPresetPopUp && (
          <button
            onClick={(e) => togglePresetsUpdate(e, PresetHandleAction.new)}
            className={`d-flex ${stylesPresets.presets_add_button}`}>
            <i className="dtable-font dtable-icon-add-table"></i>
            <p className="mx-1">{intl.get('preset_add').d(`${d.preset_add}`)}</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default PluginPresets;
