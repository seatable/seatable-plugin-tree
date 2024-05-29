// React and Related Libraries
import React, { useEffect, useState } from 'react';
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
import { CustomSettingsOption, SettingsOption } from '@/utils/types';
import { ILevelSelections } from '@/utils/custom-utils/interfaces/CustomPlugin';
// Utilities
import { truncateTableName } from 'utils/template-utils/utils';
import { findFirstLevelTables, findSecondLevelTables } from '../../../utils/custom-utils/utils';
import { THIRD_LEVEL_DATA_DEFAULT } from '../../../utils/custom-utils/constants';
// Icons
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';
// Localization
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from 'locale';
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
  onLevelSelectionChange,
  pluginPresets,
}) => {
  // State variables for table and view options
  const [tableOptions, setTableOptions] = useState<SelectOption[]>();
  const [viewOptions, setViewOptions] = useState<SelectOption[]>();
  const [tableSelectedOption, setTableSelectedOption] = useState<SelectOption>();
  const [viewSelectedOption, setViewSelectedOption] = useState<SelectOption>();
  const [firstLevelOptions, setFirstLevelOptions] = useState<SelectOption[]>();
  const [secondLevelOptions, setSecondLevelOptions] = useState<SelectOption[]>();
  const [thirdLevelOptions, setThirdLevelOptions] = useState<SelectOption[]>();
  const [firstLevelSelectedOption, setFirstLevelSelectedOption] = useState<SelectOption>();
  const [secondLevelSelectedOption, setSecondLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelSelectedOption, setThirdLevelSelectedOption] = useState<SelectOption>();
  const [thirdLevelExists, setThirdLevelExists] = useState<boolean>(true);
  const [levelSelections, setLevelSelections] = useState<ILevelSelections>(activeLevelSelections);

  useEffect(() => {
    console.log(0);
    const activeLevelSelections = pluginPresets.find((p) => p._id === appActiveState.activePresetId)
      ?.customSettings;

    if (activeLevelSelections) {
      setFirstLevelSelectedOption(activeLevelSelections?.first?.selected);
      setSecondLevelSelectedOption(activeLevelSelections?.second?.selected);
      setThirdLevelSelectedOption(activeLevelSelections?.third?.selected);
      onLevelSelectionChange(activeLevelSelections);
    }
  }, [appActiveState.activePresetId]);

  useEffect(() => {
    if (levelSelections) {
      onLevelSelectionChange(levelSelections);
    }
  }, [levelSelections]);

  // Change options when active table or view changes
  useEffect(() => {
    const { activeTableView } = appActiveState;

    // Create options for tables
    const tableOptions = allTables.map((item) => {
      const value = item._id;
      const label = truncateTableName(item.name);
      return { value, label };
    });

    // Create options for views
    const viewOptions = activeTableViews.map((item) => {
      const value = item._id;
      const label = truncateTableName(item.name);
      return { value, label };
    });

    const tableSelectedOption = {
      // eslint-disable-next-line
      value: appActiveState?.activeTable?._id!,
      label: appActiveState.activeTableName,
    };
    const viewSelectedOption = viewOptions.find((item) => item.value === activeTableView?._id);

    // Update state with new options and selected values
    setTableOptions(tableOptions);
    setTableSelectedOption(tableSelectedOption);
    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActiveState]);

  useEffect(() => {
    const FIRST_LEVEL_TABLES = findFirstLevelTables(allTables);
    const firstLevelOptions = FIRST_LEVEL_TABLES.map((item) => {
      const value = item._id;
      const label = truncateTableName(item.name);
      return { value, label };
    });
    setFirstLevelOptions(firstLevelOptions);
  }, [allTables]);

  useEffect(() => {
    let secondLevelOptions: SelectOption[] = [];
    if (firstLevelSelectedOption) {
      const SECOND_LEVEL_TABLES = findSecondLevelTables(allTables, firstLevelSelectedOption);
      secondLevelOptions = SECOND_LEVEL_TABLES.map((item) => {
        const value = item._id;
        const label = truncateTableName(item.name);
        return { value, label };
      });
    }
    setSecondLevelOptions(secondLevelOptions);
    setSecondLevelSelectedOption(secondLevelOptions[0]);
  }, [firstLevelSelectedOption]);

  useEffect(() => {
    let thirdLevelOptions: SelectOption[] = [];
    if (secondLevelSelectedOption) {
      // Finding the third level tables, using the findSecondLevelTables function
      // Using this function is correct as the third level tables are the second level tables of the second level table
      const THIRD_LEVEL_TABLES = findSecondLevelTables(allTables, secondLevelSelectedOption);
      thirdLevelOptions = THIRD_LEVEL_TABLES.map((item) => {
        const value = item._id;
        const label = truncateTableName(item.name);
        return { value, label };
      });
    }
    const filteredThirdLevelOptions = thirdLevelOptions.filter(
      (item) =>
        item.value !== firstLevelSelectedOption?.value &&
        item.value !== secondLevelSelectedOption?.value
    );
    const isEmpty = filteredThirdLevelOptions.length === 0;

    setThirdLevelExists(!isEmpty);
    setThirdLevelOptions(filteredThirdLevelOptions);
    setThirdLevelSelectedOption(isEmpty ? THIRD_LEVEL_DATA_DEFAULT : filteredThirdLevelOptions[0]);
    if (firstLevelSelectedOption && secondLevelSelectedOption) {
      setLevelSelections(
        (prevState) =>
          ({
            ...prevState,
            first: { selected: firstLevelSelectedOption },
            second: { selected: secondLevelSelectedOption },
            third: {
              selected: isEmpty ? THIRD_LEVEL_DATA_DEFAULT : filteredThirdLevelOptions[0],
            },
          }) satisfies ILevelSelections
      );
    }
  }, [secondLevelSelectedOption]);

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
          {activeComponents.settingsDropDowns && (
            <div className={stylesPSettings.settings_dropdowns}>
              <div>
                <p className="d-inline-block mb-2">{intl.get('table').d(`${d.table}`)}</p>
                {/* Toggle table view */}
                <DtableSelect
                  value={tableSelectedOption}
                  options={tableOptions}
                  onChange={(selectedOption: SelectOption) => {
                    const type = 'table' as SettingsOption;
                    onTableOrViewChange(type, selectedOption);
                  }}
                />
              </div>
              <div>
                <p className="d-inline-block mb-2 mt-3">{intl.get('view').d(`${d.view}/`)}</p>
                {/* Toggle table view */}
                <DtableSelect
                  value={viewSelectedOption}
                  options={viewOptions}
                  onChange={(selectedOption: SelectOption) => {
                    const type = 'view' satisfies SettingsOption;
                    onTableOrViewChange(type, selectedOption);
                  }}
                />
              </div>
            </div>
          )}
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
                  setFirstLevelSelectedOption(selectedOption);
                  setLevelSelections(
                    (prevState) =>
                      ({
                        ...prevState,
                        first: { selected: selectedOption },
                      }) satisfies ILevelSelections
                  );
                }}
              />
            </div>
            <div>
              <p className="d-inline-block mb-2 mt-3">
                {intl.get('customSettings.2ndLevel').d(`${d.view}/`)}
              </p>
              <DtableSelect
                value={secondLevelSelectedOption}
                options={secondLevelOptions}
                onChange={(selectedOption: SelectOption) => {
                  setSecondLevelSelectedOption(selectedOption);
                  setLevelSelections(
                    (prevState) =>
                      ({
                        ...prevState,
                        second: { selected: selectedOption },
                      }) satisfies ILevelSelections
                  );
                }}
              />
            </div>
            <div>
              <p className="d-inline-block mb-2 mt-3">
                {intl.get('customSettings.3rdLevel').d(`${d.view}/`)}
              </p>
              <DtableSelect
                isDisabled={!thirdLevelExists}
                value={thirdLevelSelectedOption}
                options={thirdLevelOptions}
                onChange={(selectedOption: SelectOption) => {
                  setThirdLevelSelectedOption(selectedOption);
                  setLevelSelections(
                    (prevState) =>
                      ({
                        ...prevState,
                        third: { selected: selectedOption },
                      }) satisfies ILevelSelections
                  );
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
