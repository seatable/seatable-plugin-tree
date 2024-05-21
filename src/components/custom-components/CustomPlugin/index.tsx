import React from 'react';
import stylesCustomP from 'c_style/CustomPlugin.module.scss';
import { ICustomPluginProps } from 'utils/interfaces/template-interfaces/CustomPlugin';
import { IPresetInfo } from 'utils/interfaces/template-interfaces/PluginPresets/Presets.interface';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  activeViewRows,
}) => (
  <div className={stylesCustomP.custom}>
    <div>Here are the listed presets for the plugin</div>
    <div className={stylesCustomP.custom_presetList}>
      {pluginPresets.map((preset: IPresetInfo) => (
        <div key={preset._id} className={stylesCustomP.custom_presetList_presetItem}>
          <div className={stylesCustomP.custom_presetList_presetItem_presetInfo}>
            <span className={stylesCustomP.custom_presetList_presetItem_presetInfo_presetId}>
              Preset ID:{' '}
            </span>
            <span>{preset._id}</span>
          </div>
          <div className={stylesCustomP.custom_presetList_presetItem_presetInfo}>
            <span className={stylesCustomP.custom_presetList_presetItem_presetInfo_presetName}>
              Preset Name:{' '}
            </span>
            <span>{preset.name}</span>
          </div>
          <div className={stylesCustomP.custom_presetList_presetItem_presetInfo}>
            <span className={stylesCustomP.custom_presetList_presetItem_presetInfo_presetName}>
              Selected Table:{' '}
            </span>
            <span>{preset.settings?.selectedTable?.label ?? 'N/A'} </span>
          </div>
          <div className={stylesCustomP.custom_presetList_presetItem_presetInfo}>
            <span className={stylesCustomP.custom_presetList_presetItem_presetInfo_presetName}>
              Selected View:{' '}
            </span>
            <span>{preset.settings?.selectedView?.label ?? 'N/A'} </span>
          </div>
        </div>
      ))}
    </div>
    <span>The Active Table and Active View of the selected Prest</span>
    <div className={stylesCustomP.custom_activeInfo}>
      <div className={stylesCustomP.custom_activeInfo_activeTable}>
        <span>{appActiveState.activeTableName}</span>
      </div>
      <div className={stylesCustomP.custom_activeInfo_activeView}>
        <span>{appActiveState?.activeTableView?.name || 'N/A'}</span>
      </div>
    </div>
    <span>The Rows of the Active Table and Active View </span>
    <div className={stylesCustomP.custom_filteredRows}>
      {activeViewRows?.map((row, index) => (
        <div key={index} className={stylesCustomP.row}>
          <span className={stylesCustomP.custom_filteredRows_row_rowNumber}>Row {index + 1}: </span>
          <span className={stylesCustomP.custom_filteredRows_row_rowContent}>{row['0000']}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CustomPlugin;
