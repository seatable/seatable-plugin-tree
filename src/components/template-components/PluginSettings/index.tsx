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
}) => {
  const [firstLevelSelectedOption, setFirstLevelSelectedOption] = useState<SelectOption>();
  const [secondLevelSelectedOption, setSecondLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelSelectedOption, setThirdLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelExists, setThirdLevelExists] = useState<boolean>(true);
  const [levelSelections, setLevelSelections] = useState<ILevelSelections>(activeLevelSelections);

  const _activeLevelSelections = useMemo(
    () => pluginPresets.find((p) => p._id === appActiveState.activePresetId)?.customSettings,
    [pluginPresets, appActiveState.activePresetId]
  );

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
    return findFirstLevelTables(allTables).map((item) => ({
      value: item._id,
      label: truncateTableName(item.name),
    }));
  }, [allTables]);

  useEffect(() => {
    setFirstLevelSelectedOption(_activeLevelSelections?.first?.selected || firstLevelOptions[0]);
  }, [firstLevelOptions, _activeLevelSelections]);

  const secondLevelOptions = useMemo(() => {
    if (!firstLevelSelectedOption) return [];
    const SECOND_LEVEL_TABLES = findSecondLevelTables(allTables, firstLevelSelectedOption);

    return SECOND_LEVEL_TABLES.map((item) => ({
      value: item._id,
      label: truncateTableName(item.name),
    }));
  }, [allTables, firstLevelSelectedOption]);

  useEffect(() => {
    const isSelectedInOptions = secondLevelOptions.some(
      (i) => i.value === activeLevelSelections.second?.selected?.value
    );
    setSecondLevelSelectedOption(
      isSelectedInOptions
        ? _activeLevelSelections?.second?.selected || secondLevelOptions[0]
        : secondLevelOptions[0]
    );
  }, [secondLevelOptions, activeLevelSelections, _activeLevelSelections]);

  const thirdLevelOptions = useMemo(() => {
    if (!firstLevelSelectedOption || !secondLevelSelectedOption) return [];

    const THIRD_LEVEL_TABLES = findSecondLevelTables(allTables, secondLevelSelectedOption);

    return THIRD_LEVEL_TABLES.map((item) => ({
      value: item._id,
      label: truncateTableName(item.name),
    })).filter(
      (item) =>
        item.label !== firstLevelSelectedOption.label &&
        item.value !== secondLevelSelectedOption.value
    );
  }, [allTables, firstLevelSelectedOption, secondLevelSelectedOption]);

  useEffect(() => {
    const isSelectedInOptions = thirdLevelOptions.some(
      (i) => i.value === activeLevelSelections.third?.selected?.value
    );
    setThirdLevelSelectedOption(
      isSelectedInOptions
        ? _activeLevelSelections?.third?.selected || thirdLevelOptions[0]
        : thirdLevelOptions[0]
    );
    setThirdLevelExists(thirdLevelOptions.length > 0);
  }, [thirdLevelOptions, activeLevelSelections, _activeLevelSelections]);

  const handleLevelSelection = useCallback(
    (selectedOption: SelectOption, level: CustomSettingsOption) => {
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

  const handleLevelDisabled = useCallback(
    (level: 'second' | 'third') => {
      console.log('handleLevelDisabled');
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
            },
            third: {
              selected: thirdSelected,
              isDisabled: !activeLevelSelections.second.isDisabled,
            },
          };
          break;
        case 'third':
          newLevelSelections = {
            ...levelSelections,
            third: {
              selected: thirdSelected,
              isDisabled: !activeLevelSelections?.third?.isDisabled,
            },
          };
          break;
      }

      setLevelSelections(newLevelSelections);
      updateLevelSelections(newLevelSelections);
    },
    [activeLevelSelections, levelSelections, updateLevelSelections]
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
          <div className={stylesPSettings.settings_dropdowns}>
            <div>
              <p className="d-inline-block mb-2">
                {intl.get('customSettings.1stLevel').d(`${d.table}`)}
              </p>
              <DtableSelect
                value={firstLevelSelectedOption}
                options={firstLevelOptions}
                onChange={(selectedOption: SelectOption) => {
                  handleLevelSelection(selectedOption, 'first');
                }}
              />
            </div>
            <div>
              <div className={'mt-2'}>
                <div className="mt-2 d-flex align-items-center justify-content-between">
                  <p className="d-inline-block mb-2 mt-3">
                    {intl.get('customSettings.2ndLevel').d(`${d.view}/`)}
                  </p>
                  <div className="d-flex align-items-center">
                    <p className="d-inline-block mb-2 mt-3">
                      {intl
                        .get('customSettings.ScnLevelDisabled')
                        .d(`${d.customSettings.ScnLevelDisabled}`)}
                    </p>
                    <button
                      onClick={() => {
                        handleLevelDisabled('second');
                      }}
                      className={`${
                        activeLevelSelections.second.isDisabled
                          ? stylesPSettings.settings_toggle_btns_active
                          : stylesPSettings.settings_toggle_btns
                      } `}></button>
                  </div>
                </div>
              </div>
              <DtableSelect
                value={secondLevelSelectedOption}
                options={secondLevelOptions}
                isDisabled={activeLevelSelections.second.isDisabled}
                onChange={(selectedOption: SelectOption) => {
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
                      {intl
                        .get('customSettings.ScnLevelDisabled')
                        .d(`${d.customSettings.ScnLevelDisabled}`)}
                    </p>
                    <button
                      disabled={!thirdLevelExists || activeLevelSelections.second.isDisabled}
                      onClick={() => {
                        handleLevelDisabled('third');
                      }}
                      className={`${
                        !thirdLevelExists || activeLevelSelections.third?.isDisabled
                          ? stylesPSettings.settings_toggle_btns_active
                          : stylesPSettings.settings_toggle_btns
                      } `}></button>
                  </div>
                </div>
              </div>
              <DtableSelect
                value={thirdLevelSelectedOption}
                options={thirdLevelOptions}
                isDisabled={
                  !thirdLevelExists ||
                  activeLevelSelections.second.isDisabled ||
                  activeLevelSelections.third?.isDisabled
                }
                onChange={(selectedOption: SelectOption) => {
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
