/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import deepCopy from 'deep-copy';
import DtableSelect from '../Elements/dtable-select';
import stylesPSettings from 't_styles/PluginSettings.module.scss';
import stylesPresets from 't_styles/PluginPresets.module.scss';
import {
  SelectOption,
  IPluginSettingsProps,
} from '@/utils/template-utils/interfaces/PluginSettings.interface';
import { CustomSettingsOption } from '@/utils/types';
import { ILevelSelections } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { truncateTableName } from 'utils/template-utils/utils';
import { findFirstLevelTables, findSecondLevelTables } from '../../../utils/custom-utils/utils';
import { LEVEL_DATA_DEFAULT } from '../../../utils/custom-utils/constants';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from 'locale';

const { [DEFAULT_LOCALE]: d } = AVAILABLE_LOCALES;

const PluginSettings: React.FC<IPluginSettingsProps> = ({
  allTables,
  columnsCount,
  appActiveState,
  activeTableViews,
  isShowSettings,
  onToggleSettings,
  onTableOrViewChange,
  activeComponents,
  activeLevelSelections,
  pluginDataStore,
  pluginPresets,
  updatePresets,
  setActiveLevelSelections,
}) => {
  const { activeTableView } = appActiveState;
  const [firstLevelSelectedOption, setFirstLevelSelectedOption] = useState<SelectOption>();
  const [secondLevelSelectedOption, setSecondLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelSelectedOption, setThirdLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelExists, setThirdLevelExists] = useState<boolean>(true);
  const [levelSelections, setLevelSelections] = useState<ILevelSelections>(activeLevelSelections);
  const [viewOptions, setViewOptions] = useState<SelectOption[]>();
  const [viewSelectedOption, setViewSelectedOption] = useState<SelectOption>();

  const _activeLevelSelections = useMemo(
    () => pluginPresets.find((p) => p._id === appActiveState.activePresetId)?.customSettings,
    [pluginPresets, appActiveState.activePresetId]
  );

  useEffect(() => {
    if (_activeLevelSelections) {
      setFirstLevelSelectedOption(_activeLevelSelections.first.selected);
      setSecondLevelSelectedOption(_activeLevelSelections.second.selected);
      setThirdLevelSelectedOption(_activeLevelSelections?.third?.selected);
      setLevelSelections(_activeLevelSelections);
    }
  }, [_activeLevelSelections]);

  const updateLevelSelections = useCallback(
    (levelSelections: ILevelSelections) => {
      const _id = appActiveState.activePresetId;
      const newPluginPresets = deepCopy(pluginPresets);
      const oldPreset = newPluginPresets.find((p) => p._id === _id);
      if (!oldPreset) {
        throw new Error('Preset not found');
      }
      const _idx = newPluginPresets.findIndex((p) => p._id === _id);

      const updatedPreset = {
        ...oldPreset,
        customSettings: levelSelections,
      };

      newPluginPresets.splice(_idx, 1, updatedPreset);
      pluginDataStore.presets = newPluginPresets;

      updatePresets(appActiveState.activePresetIdx, newPluginPresets, pluginDataStore, _id);
    },
    [
      pluginPresets,
      appActiveState.activePresetId,
      pluginDataStore,
      updatePresets,
      appActiveState.activePresetIdx,
    ]
  );

  const firstLevelOptions = useMemo(() => {
    const firstOptions = findFirstLevelTables(allTables).map((item) => ({
      value: item._id,
      label: truncateTableName(item.name),
    }));

    const checkFirstOptions =
      firstOptions.length === 0
        ? [{ value: allTables[0]._id, label: allTables[0].name }]
        : firstOptions;

    return checkFirstOptions;
  }, [allTables, columnsCount]);

  useEffect(() => {
    setFirstLevelSelectedOption(_activeLevelSelections?.first?.selected || firstLevelOptions[0]);
    handleFirstLevelSelection(
      _activeLevelSelections?.first?.selected || firstLevelOptions[0],
      true
    );
  }, [firstLevelOptions]);

  const secondLevelOptions = useMemo(() => {
    if (!firstLevelSelectedOption) return [];
    const SECOND_LEVEL_TABLES = findSecondLevelTables(allTables, firstLevelSelectedOption);

    return [
      { value: '00000', label: 'Not used' },
      ...SECOND_LEVEL_TABLES.map((item) => ({
        value: item._id,
        label: truncateTableName(item.name),
      })),
    ].filter((item) => item.label !== firstLevelSelectedOption.label || item.value === '00000');
  }, [JSON.stringify(allTables), firstLevelSelectedOption]);

  const thirdLevelOptions = useMemo(() => {
    if (!firstLevelSelectedOption || !secondLevelSelectedOption) return [];

    const THIRD_LEVEL_TABLES = findSecondLevelTables(allTables, secondLevelSelectedOption);

    return [
      { value: '00000', label: 'Not used' },
      ...THIRD_LEVEL_TABLES.map((item) => ({
        value: item._id,
        label: truncateTableName(item.name),
      })),
    ].filter(
      (item) =>
        (item.label !== firstLevelSelectedOption.label || item.value === '00000') &&
        (item.value !== secondLevelSelectedOption.value || item.value === '00000')
    );
  }, [JSON.stringify(allTables), firstLevelSelectedOption, secondLevelSelectedOption]);

  useEffect(() => {
    if (
      thirdLevelSelectedOption &&
      !thirdLevelOptions.map((op) => op.value).includes(thirdLevelSelectedOption.value)
    ) {
      console.log(thirdLevelSelectedOption);
      const selectedOption = thirdLevelOptions[1] || thirdLevelOptions[0];
      setThirdLevelSelectedOption(selectedOption);
      setThirdLevelExists(thirdLevelOptions.length > 0);

      setActiveLevelSelections({
        ...activeLevelSelections,
        third: {
          ...activeLevelSelections.third,
          selected: selectedOption,
          isDisabled: selectedOption.value === '00000',
        },
      });
    }
  }, [thirdLevelOptions, levelSelections]);

  const handleLevelSelection = useCallback(
    (selectedOption: SelectOption, level: CustomSettingsOption) => {
      if (
        (level !== 'first' && selectedOption.value === '00000') ||
        (level === 'second' && activeLevelSelections.second.isDisabled) ||
        (level === 'third' && activeLevelSelections.third?.isDisabled)
      ) {
        handleLevelDisabled(level);
        return;
      }

      if (level === 'first') {
        handleFirstLevelSelection(selectedOption);
        return;
      }

      const setSelectedOptionFunctions = {
        first: setFirstLevelSelectedOption,
        second: setSecondLevelSelectedOption,
        third: setThirdLevelSelectedOption,
      };

      setSelectedOptionFunctions[level](selectedOption);

      setLevelSelections((prevState) => ({
        ...prevState,
        [level]: { selected: selectedOption, isDisabled: levelSelections[level]?.isDisabled },
      }));

      updateLevelSelections({
        ...levelSelections,
        [level]: {
          selected: selectedOption,
          isDisabled: levelSelections[level]?.isDisabled,
        },
      });
    },
    [levelSelections, updateLevelSelections]
  );

  const handleLevelSorting = useCallback(
    (level: 'second' | 'third') => {
      let newLevelSelections;
      const thirdSelected = activeLevelSelections.third
        ? activeLevelSelections.third.selected
        : LEVEL_DATA_DEFAULT;

      switch (level) {
        case 'second':
          newLevelSelections = {
            ...activeLevelSelections,
            second: {
              selected: activeLevelSelections.second.selected,
              isDisabled: activeLevelSelections.second.isDisabled,
              isSorted: !activeLevelSelections.second.isSorted,
            },
          };
          break;
        case 'third':
          newLevelSelections = {
            ...levelSelections,
            third: {
              selected: thirdSelected,
              isDisabled: activeLevelSelections.third!.isDisabled,
              isSorted: !activeLevelSelections?.third?.isSorted,
            },
          };
          break;
      }

      setLevelSelections(newLevelSelections);
      updateLevelSelections(newLevelSelections);
    },
    [activeLevelSelections, levelSelections, updateLevelSelections]
  );

  const handleFirstLevelSelection = (selectedOption: SelectOption, noUpdate?: boolean) => {
    console.log('handleFirstLevelSelection');
    const _table = allTables.find((table) => table._id === selectedOption.value);
    const _views = _table?.views || [];

    // Create options for views
    const viewOptions = _views.map((item) => ({
      value: item._id,
      label: truncateTableName(item.name),
    }));
    const viewSelectedOption =
      viewOptions.find((item) => item.value === activeTableView?._id) || viewOptions[0];

    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);

    const secondLevelOptions = findSecondLevelTables(allTables, selectedOption)
      .map((item) => ({
        value: item._id,
        label: truncateTableName(item.name),
      }))
      .filter((item) => item.label !== selectedOption.label || item.value === '00000');

    const thirdLevelOptions = findSecondLevelTables(allTables, secondLevelOptions[0])
      .map((item) => ({
        value: item._id,
        label: truncateTableName(item.name),
      }))
      .filter((item) => item.label !== secondLevelOptions[0].label || item.value === '00000');

    setSecondLevelSelectedOption(secondLevelOptions[0]);
    setThirdLevelSelectedOption(thirdLevelOptions[0]);

    setLevelSelections({
      first: { selected: selectedOption, isDisabled: levelSelections.first?.isDisabled },
      second: {
        selected: secondLevelOptions[0],
        isDisabled: levelSelections.second?.isDisabled,
      },
      third: { selected: thirdLevelOptions[0], isDisabled: levelSelections.third?.isDisabled! },
    });

    !noUpdate &&
      updateLevelSelections({
        first: { selected: selectedOption, isDisabled: levelSelections.first?.isDisabled },
        second: {
          selected: secondLevelOptions[0],
          isDisabled: levelSelections.second?.isDisabled,
        },
        third: { selected: thirdLevelOptions[0], isDisabled: levelSelections.third?.isDisabled! },
      });
  };

  const handleLevelDisabled = useCallback(
    (level: 'second' | 'third') => {
      let newLevelSelections;
      const thirdSelected = activeLevelSelections.third
        ? activeLevelSelections.third.selected
        : LEVEL_DATA_DEFAULT;

      switch (level) {
        case 'second':
          newLevelSelections = {
            ...activeLevelSelections,
            second: {
              selected: activeLevelSelections.second.selected,
              isDisabled: !activeLevelSelections.second.isDisabled,
              isSorted: activeLevelSelections.second.isSorted,
            },
            third: {
              selected: thirdSelected,
              isDisabled: !activeLevelSelections.second.isDisabled,
              isSorted: activeLevelSelections.third?.isSorted,
            },
          };
          break;
        case 'third':
          newLevelSelections = {
            ...levelSelections,
            third: {
              selected: thirdSelected,
              isDisabled: !activeLevelSelections?.third?.isDisabled,
              isSorted: activeLevelSelections.third?.isSorted,
            },
          };
          break;
      }

      setLevelSelections(newLevelSelections);
      updateLevelSelections(newLevelSelections);
    },
    [activeLevelSelections, levelSelections, updateLevelSelections]
  );

  const selectedViewOption = viewOptions?.find((op) => op.value === viewSelectedOption?.value);
  const selectedFirstLevel = firstLevelOptions?.find(
    (op) => op.value === firstLevelSelectedOption?.value
  );
  const selectedSecondLevel = secondLevelOptions?.find(
    (op) => op.value === secondLevelSelectedOption?.value
  );
  const selectedThirdLevel = thirdLevelOptions?.find(
    (op) => op.value === thirdLevelSelectedOption?.value
  );

  return (
    <div
      className={`bg-white ${
        isShowSettings ? stylesPSettings.settings : stylesPSettings.settings_hide
      }`}>
      <div className="p-5">
        <div
          className={`d-flex align-items-center justify-content-between ${stylesPSettings.settings_header}`}>
          <h4 className="m-0">{intl.get('settings_headline').d(`${d.settings_headline}`)}</h4>
          <button
            className={stylesPresets.presets_uncollapse_btn2_settings}
            onClick={onToggleSettings}>
            <HiOutlineChevronDoubleRight />
          </button>
        </div>
        <div>
          <div className={stylesPSettings.settings_dropdowns} style={{ border: 'none' }}>
            <div className={stylesPSettings.settings_dropdowns}>
              <div>
                <p className="d-inline-block mb-2">
                  {intl.get('customSettings.1stLevel').d(`${d.table}`)}
                </p>
                <DtableSelect
                  value={selectedFirstLevel}
                  options={firstLevelOptions}
                  onChange={(selectedOption: SelectOption) => {
                    setFirstLevelSelectedOption(selectedOption);
                    handleLevelSelection(selectedOption, 'first');
                  }}
                />
              </div>
              <div>
                <p className="d-inline-block mb-2 mt-3">{intl.get('view').d(`${d.view}`)}</p>
                {/* Toggle table view */}
                <DtableSelect
                  value={selectedViewOption}
                  options={viewOptions}
                  onChange={(selectedOption: SelectOption) => {
                    setViewSelectedOption(selectedOption);
                    onTableOrViewChange(
                      'view',
                      selectedOption,
                      allTables.find((t) => t._id === firstLevelSelectedOption?.value)!
                    );
                  }}
                />
              </div>
            </div>

            <div>
              <div className={'mt-2'}>
                <div className="mt-2 d-flex align-items-center justify-content-between">
                  <p className="d-inline-block mb-2 mt-3">
                    {intl.get('customSettings.2ndLevel').d(`${d.view}/`)}
                  </p>
                  <div className="d-flex align-items-center">
                    <p className="d-inline-block mb-2 mt-3">
                      {intl.get('customSettings.LevelSorted').d(`${d.customSettings.LevelSorted}`)}
                    </p>
                    <button
                      onClick={() => {
                        handleLevelSorting('second');
                      }}
                      className={`${
                        activeLevelSelections.second.isSorted
                          ? stylesPSettings.settings_toggle_btns_active
                          : stylesPSettings.settings_toggle_btns
                      } `}></button>
                  </div>
                </div>
              </div>
              <DtableSelect
                value={
                  activeLevelSelections.second.isDisabled
                    ? secondLevelOptions[0]
                    : selectedSecondLevel
                }
                options={secondLevelOptions}
                onChange={(selectedOption: SelectOption) => {
                  setSecondLevelSelectedOption(selectedOption);
                  handleLevelSelection(selectedOption, 'second');
                }}
              />
            </div>
            <div>
              <div className={'mt-2'}>
                <div className="mt-2 d-flex align-items-center justify-content-between">
                  <p className="d-inline-block mb-2 mt-3">
                    {intl.get('customSettings.3rdLevel').d(`${d.view}/`)}
                  </p>
                  <div className="d-flex align-items-center">
                    <p className="d-inline-block mb-2 mt-3">
                      {intl.get('customSettings.LevelSorted').d(`${d.customSettings.LevelSorted}`)}
                    </p>
                    <button
                      onClick={() => {
                        handleLevelSorting('third');
                      }}
                      className={`${
                        activeLevelSelections.third?.isSorted
                          ? stylesPSettings.settings_toggle_btns_active
                          : stylesPSettings.settings_toggle_btns
                      } `}></button>
                  </div>
                </div>
              </div>
              <DtableSelect
                value={
                  !thirdLevelExists ||
                  activeLevelSelections.second.isDisabled ||
                  activeLevelSelections.third?.isDisabled
                    ? thirdLevelOptions[0]
                    : selectedThirdLevel
                }
                options={
                  (!thirdLevelExists ||
                    activeLevelSelections.second.isDisabled ||
                    activeLevelSelections.third?.isDisabled) &&
                  activeLevelSelections.second?.isDisabled
                    ? [thirdLevelOptions[0]]
                    : thirdLevelOptions
                }
                onChange={(selectedOption: SelectOption) => {
                  setThirdLevelSelectedOption(selectedOption);
                  handleLevelSelection(selectedOption, 'third');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginSettings;
