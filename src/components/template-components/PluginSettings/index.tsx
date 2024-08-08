// React and Related Libraries
import React, { useCallback, useEffect, useState } from 'react';
import deepCopy from 'deep-copy';
// Components
import DtableSelect from '../Elements/dtable-select';
// Styles
import stylesPSettings from 't_styles/PluginSettings.module.scss';
import stylesPresets from 't_styles/PluginPresets.module.scss';
// Interfaces and Types
import {
  SelectOption,
  IPluginSettingsProps,
} from '@/utils/template-utils/interfaces/PluginSettings.interface';
import { CustomSettingsOption } from '@/utils/types';
import { ILevelSelections } from '@/utils/custom-utils/interfaces/CustomPlugin';
// Utilities
import { truncateTableName } from 'utils/template-utils/utils';
import { findFirstLevelTables, findSecondLevelTables } from '../../../utils/custom-utils/utils';
import { LEVEL_DATA_DEFAULT } from '../../../utils/custom-utils/constants';
// Icons
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';
// Localization
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from 'locale';
import { PresetsArray } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';

const { [DEFAULT_LOCALE]: d } = AVAILABLE_LOCALES;

// PluginSettings component for managing table and view options
const PluginSettings: React.FC<IPluginSettingsProps> = ({
  allTables,
  appActiveState,
  activeTableViews,
  isShowSettings,
  onToggleSettings,
  onTableOrViewChange,
  activeComponents,
  activeLevelSelections,
  // onLevelSelectionChange,
  pluginDataStore,
  pluginPresets,
  updatePresets,
}) => {
  // State variables for table and view options
  // let _activePresetId = '';
  const [firstLevelOptions, setFirstLevelOptions] = useState<SelectOption[]>();
  const [secondLevelOptions, setSecondLevelOptions] = useState<SelectOption[]>();
  const [thirdLevelOptions, setThirdLevelOptions] = useState<SelectOption[]>();
  const [firstLevelSelectedOption, setFirstLevelSelectedOption] = useState<SelectOption>();
  const [secondLevelSelectedOption, setSecondLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelSelectedOption, setThirdLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelExists, setThirdLevelExists] = useState<boolean>(true);
  const [levelSelections, setLevelSelections] = useState<ILevelSelections>(activeLevelSelections);

  const _activeLevelSelections = pluginPresets.find((p) => p._id === appActiveState.activePresetId)
  ?.customSettings;

  const updateLevelSelections = useCallback(
    (levelSelections: ILevelSelections) => {
      console.log("hey")
      const _id = appActiveState.activePresetId;
      const newPluginPresets = deepCopy(pluginPresets);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const oldPreset = pluginPresets.find((p) => p._id === _id)!;
      const _idx = pluginPresets.findIndex((p) => p._id === _id);

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

  useEffect(() => {
    const FIRST_LEVEL_TABLES = findFirstLevelTables(allTables);
    const firstLevelOptions = FIRST_LEVEL_TABLES.map((item) => {
      const value = item._id;
      const label = truncateTableName(item.name);
      return { value, label };
    });

    setFirstLevelOptions(firstLevelOptions);
    setFirstLevelSelectedOption(_activeLevelSelections?.first?.selected || firstLevelOptions[0]);
  }, [JSON.stringify(allTables), appActiveState.activePresetId]);

  useEffect(() => {
    let secondLevelOptions: SelectOption[] = [];
    if (firstLevelSelectedOption) {
      const SECOND_LEVEL_TABLES = findSecondLevelTables(allTables, firstLevelSelectedOption);

      secondLevelOptions = SECOND_LEVEL_TABLES.map((item) => {
        const value = item._id;
        const label = truncateTableName(item.name);
        return { value, label };
      });
      // handleLevelSelection(secondLevelOptions[0], 'second');
    }
    setSecondLevelOptions(secondLevelOptions);
    setSecondLevelSelectedOption(_activeLevelSelections?.second?.selected || secondLevelOptions[0]);
  }, [firstLevelSelectedOption, firstLevelOptions]);

  useEffect(() => {
    let thirdLevelOptions: SelectOption[] = [];
    if (firstLevelSelectedOption && secondLevelSelectedOption) {
      const THIRD_LEVEL_TABLES = findSecondLevelTables(allTables, secondLevelSelectedOption);

      thirdLevelOptions = THIRD_LEVEL_TABLES.map((item) => {
        const value = item._id;
        const label = truncateTableName(item.name);
        return { value, label };
      }).filter(
        (item) =>
          item.label !== firstLevelSelectedOption.label &&
          item.value !== secondLevelSelectedOption.value
      );
      // handleLevelSelection(thirdLevelOptions[0], 'third');
    }
    setThirdLevelOptions(thirdLevelOptions);
    setThirdLevelSelectedOption(_activeLevelSelections?.third?.selected || thirdLevelOptions[0]);
  }, [secondLevelSelectedOption, secondLevelOptions]);

  // useEffect(() => {
  //   const activeLevelSelections = pluginPresets.find((p) => p._id === appActiveState.activePresetId)
  //     ?.customSettings;

  //   console.log('activeLevelSelections', activeLevelSelections);
  //   if (activeLevelSelections) {
  //     setFirstLevelSelectedOption(activeLevelSelections?.first?.selected);
  //     setSecondLevelSelectedOption(activeLevelSelections?.second?.selected);
  //     setThirdLevelSelectedOption(activeLevelSelections?.third?.selected);
  //     // onLevelSelectionChange(activeLevelSelections);
  //   }
  // }, [appActiveState.activePresetId]);

  // useEffect(() => {
  //   let thirdLevelOptions: SelectOption[] = [];
  //   if (firstLevelSelectedOption && secondLevelSelectedOption) {
  //     // Finding the third level tables, using the findSecondLevelTables function
  //     // Using this function is correct as the third level tables are the second level tables of the second level table
  //     const THIRD_LEVEL_TABLES = findSecondLevelTables(allTables, secondLevelSelectedOption);

  //     // Creating options for the third level tables and filtering out the selected options from the first and second levels
  //     thirdLevelOptions = THIRD_LEVEL_TABLES.map((item) => {
  //       const value = item._id;
  //       const label = truncateTableName(item.name);
  //       return { value, label };
  //     }).filter(
  //       (item) =>
  //         item.label !== firstLevelSelectedOption.label &&
  //         item.value !== secondLevelSelectedOption.value
  //     );
  //   }

  //   // Checking if the third level options are empty
  //   const activeThirdLevelSelectedOption = thirdLevelOptions.find(
  //     (i) => i.value === activeLevelSelections.third?.selected.value
  //   )
  //     ? activeLevelSelections.third?.selected
  //     : thirdLevelOptions[0];

  //   const isEmpty = thirdLevelOptions.length === 0;

  //   const thirdLevelSelectedOptionLastCheck = isEmpty
  //     ? LEVEL_DATA_DEFAULT
  //     : activeThirdLevelSelectedOption;

  //   setThirdLevelExists(!isEmpty);
  //   setThirdLevelOptions(thirdLevelOptions);
  //   setThirdLevelSelectedOption(thirdLevelSelectedOptionLastCheck);
  //   if (
  //     firstLevelSelectedOption &&
  //     secondLevelSelectedOption &&
  //     thirdLevelSelectedOptionLastCheck
  //   ) {
  //     handleLevelSelection(thirdLevelSelectedOptionLastCheck, 'third');
  //   }
  // }, [secondLevelSelectedOption, secondLevelOptions, firstLevelOptions, firstLevelSelectedOption]);

  const handleLevelSelection = (selectedOption: SelectOption, level: CustomSettingsOption) => {
    const setSelectedOptionFunctions: Record<
      CustomSettingsOption,
      React.Dispatch<React.SetStateAction<SelectOption | undefined>>
    > = {
      first: setFirstLevelSelectedOption,
      second: setSecondLevelSelectedOption,
      third: setThirdLevelSelectedOption,
    };

    const setSelectedOption = setSelectedOptionFunctions[level];
    setSelectedOption(selectedOption);

    setLevelSelections(
      (prevState) =>
        ({
          ...prevState,
          [level]: { selected: selectedOption, isDisabled: levelSelections[level]?.isDisabled },
        }) satisfies ILevelSelections
    );

    updateLevelSelections({
      ...levelSelections,
      [level]: {
        selected: selectedOption,
        isDisabled: levelSelections[level]?.isDisabled,
      },
    });
  };

  const handleLevelDisabled = (level: 'second' | 'third') => {
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
  };

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
          {/* CUSTOM SETTINGS */}
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
