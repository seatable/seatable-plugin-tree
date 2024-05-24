import React, { useEffect, useState } from 'react';
import DtableSelect from '../Elements/dtable-select';
import stylesPSettings from 't_styles/PluginSettings.module.scss';
import stylesPresets from 't_styles/PluginPresets.module.scss';
import {
  SelectOption,
  IPluginSettingsProps,
} from '@/utils/template-utils/interfaces/PluginSettings.interface';
import { truncateTableName } from 'utils/template-utils/utils';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';
import { CustomSettingsOption, SettingsOption } from '@/utils/types';
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from 'locale';
import { findFirstLevelTables } from '../../../utils/custom-utils/utils';
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

    // Set selected options based on activeTable and activeTableView
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
    console.log(1);
    const FIRST_LEVEL_TABLES = findFirstLevelTables(allTables);
    const firstLevelOptions = FIRST_LEVEL_TABLES.map((item) => {
      const value = item._id;
      const label = truncateTableName(item.name);
      return { value, label };
    });
    setFirstLevelOptions(firstLevelOptions);
    setFirstLevelSelectedOption(firstLevelOptions[0]); // TBD: This should be set based on the value in Settings
    console.log('firstLevelOptions', firstLevelOptions);
  }, [allTables]);

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
              {/* Toggle table view */}
              <DtableSelect
                value={firstLevelSelectedOption}
                options={firstLevelOptions}
                onChange={(selectedOption: SelectOption) => {
                  const type = 'first' satisfies CustomSettingsOption;
                  setFirstLevelSelectedOption(selectedOption);
                  // onTableOrViewChange(type, selectedOption);
                }}
              />
            </div>
            <div>
              <p className="d-inline-block mb-2 mt-3">
                {intl.get('customSettings.2ndLevel').d(`${d.view}/`)}
              </p>
              {/* Toggle table view */}
              <DtableSelect
                value={secondLevelSelectedOption}
                options={secondLevelOptions}
                onChange={(selectedOption: SelectOption) => {
                  const type = 'second' satisfies CustomSettingsOption;
                  // onTableOrViewChange(type, selectedOption);
                }}
              />
            </div>
            <div>
              <p className="d-inline-block mb-2 mt-3">
                {intl.get('customSettings.3rdLevel').d(`${d.view}/`)}
              </p>
              {/* Toggle table view */}
              <DtableSelect
                value={thirdLevelSelectedOption}
                options={thirdLevelOptions}
                onChange={(selectedOption: SelectOption) => {
                  const type = 'third' satisfies CustomSettingsOption;
                  // onTableOrViewChange(type, selectedOption);
                }}
              />
            </div>
          </div>
          {/* Insert custom settings */}
        </div>
      </div>
    </div>
  );
};

export default PluginSettings;
