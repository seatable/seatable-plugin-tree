/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import deepCopy from 'deep-copy';
import ExpandableItem from './ExpandableItem';
import HeaderRow from './HeaderRow';
import { TableColumn } from '../../utils/template-utils/interfaces/Table.interface';
import { PLUGIN_NAME } from '../../utils/template-utils/constants';
import {
  addRowItem,
  getLevelSelectionAndTable,
  getRowsByTableId,
  isArraysEqual,
  isLevelSelectionDisabled,
  outputLevelsInfo,
  paddingAddBtn,
  updateExpandedState,
} from '../../utils/custom-utils/utils';
import {
  IPluginTLProps,
  RowExpandedInfo,
  levelRowInfo,
  levelsStructureInfo,
} from '../../utils/custom-utils/interfaces/CustomPlugin';
import styles from '../../styles/custom-styles/CustomPlugin.module.scss';
import { ResizeDetail } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';

const PluginTL: React.FC<IPluginTLProps> = ({
  allTables,
  levelSelections,
  pluginDataStore,
  activePresetId,
  resetDataValue,
  isDevelopment,
  activePresetIdx,
  pluginPresets,
  updatePresets,
}) => {
  console.log(
    'first',
    pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows
  );
  const [finalResult, setFinalResult] = useState<levelsStructureInfo>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [tableName, setTableName] = useState<string>('');
  const [columnWidths, setColumnWidths] = useState<ResizeDetail[]>(
    pluginPresets[activePresetIdx].settings?.resize_details || []
  );
  const [expandedRowsInfo, setExpandedRowsInfo] = useState<RowExpandedInfo[]>(
    pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows || []
  );
  const [expandedHasChanged, setExpandedHasChanged] = useState<boolean>(false);
  const [rowsEmptyArray] = useState<boolean>(false);
  const [minRowWidth, setMinRowWidth] = useState<number>(0);

  const { levelTable } = getLevelSelectionAndTable(0, allTables, levelSelections);

  const firstLevelTable = useMemo(
    () => allTables.find((t) => t._id === levelSelections.first.selected?.value),
    [JSON.stringify(allTables), levelSelections.first.selected?.value]
  );

  const handleItemClick = (updatedRow: RowExpandedInfo): void => {
    const updatedRows = updateExpandedState(updatedRow, expandedRowsInfo);
    console.log({ handleItemClick: expandedRowsInfo[0].expanded });
    setExpandedRowsInfo(updatedRows);

    window.dtableSDK.updatePluginSettings(PLUGIN_NAME, {
      ...pluginDataStore,
      presets: pluginDataStore.presets.map((preset) => {
        if (preset._id === activePresetId) {
          return {
            ...preset,
            expandedRows: updatedRows,
          };
        }
        return preset;
      }),
    });

    setExpandedHasChanged(!expandedHasChanged);
  };

  const updateResizeDetails = useCallback(
    (resize_details: ResizeDetail[]) => {
      const newPluginPresets = deepCopy(pluginPresets);
      const oldPreset = pluginPresets.find((p) => p._id === activePresetId)!;
      const _idx = pluginPresets.findIndex((p) => p._id === activePresetId);
      const settings = {
        ...oldPreset?.settings,
        resize_details,
      };
      const updatedPreset = { ...oldPreset, settings, _id: activePresetId };

      newPluginPresets.splice(_idx, 1, updatedPreset);
      pluginDataStore.presets = newPluginPresets;

      updatePresets(activePresetIdx, newPluginPresets, pluginDataStore, activePresetId);
    },
    [pluginPresets, activePresetId, pluginDataStore, updatePresets, activePresetIdx]
  );

  useEffect(() => {
    // Set initial expanded rows from plugin data store
    const newRowsExpandedInfo = pluginDataStore.presets.find(
      (preset) => preset._id === activePresetId
    )?.expandedRows;
    if (newRowsExpandedInfo !== undefined) {
      console.log({ useEffect: expandedRowsInfo[0].expanded });
      setExpandedRowsInfo(newRowsExpandedInfo);
    }
  }, [activePresetId, pluginDataStore.presets]);

  useEffect(() => {
    if (firstLevelTable && firstLevelTable.columns) {
      setColumns(firstLevelTable.columns);
      setTableName(firstLevelTable.name);
    }
  }, [firstLevelTable]);

  const firstRows = useMemo(() => {
    return getRowsByTableId(levelSelections.first.selected?.value, allTables);
  }, [JSON.stringify(allTables), levelSelections.first.selected?.value]);

  const memoizedOutputLevelsInfo = useMemo(() => {
    // at this point the expanded rows info changes
    console.log({ PluginTL: expandedRowsInfo[0].expanded });

    if (firstRows && firstLevelTable) {
      const firstTableId = levelSelections.first.selected?.value;
      return outputLevelsInfo(
        levelSelections,
        firstTableId,
        firstRows,
        expandedRowsInfo,
        levelSelections.second.selected?.value,
        allTables,
        levelSelections?.third?.selected?.value
      );
    }
    return null;
  }, [
    levelSelections,
    firstRows,
    expandedRowsInfo,
    JSON.stringify(allTables),
    levelSelections?.third?.selected?.value,
    firstLevelTable,
  ]);

  useEffect(() => {
    if (memoizedOutputLevelsInfo) {
      setFinalResult(memoizedOutputLevelsInfo.cleanFinalResult);
      console.log({ useEffectSecond: expandedRowsInfo[0].expanded });
      setExpandedRowsInfo((prevExpandedRowsInfo) => {
        const newExpandedRows = isArraysEqual(
          prevExpandedRowsInfo,
          memoizedOutputLevelsInfo.cleanExpandedRowsObj
        )
          ? prevExpandedRowsInfo
          : memoizedOutputLevelsInfo.cleanExpandedRowsObj;

        return prevExpandedRowsInfo !== newExpandedRows ? newExpandedRows : prevExpandedRowsInfo;
      });
    }
  }, [memoizedOutputLevelsInfo]);

  const calculateRowWidths = useCallback(() => {
    const rows = Array.from(document.querySelectorAll('.expandableItem'));
    return rows.map((row) => row.clientWidth);
  }, []);

  useEffect(() => {
    const rowWidths = calculateRowWidths();

    if (rowWidths.length === finalResult.length) {
      setMinRowWidth(0);
    } else {
      setMinRowWidth(Math.max(...rowWidths) || 0);
    }
  }, [finalResult, calculateRowWidths]);

  return (
    <>
      <HeaderRow
        columns={columns}
        level={1}
        tableName={tableName}
        levelSelections={levelSelections}
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        updateResizeDetails={updateResizeDetails}
      />
      {finalResult &&
        finalResult.map((i: levelRowInfo) => (
          <ExpandableItem
            key={i._id}
            item={i}
            level={1}
            rowsEmptyArray={rowsEmptyArray}
            expandedHasChanged={expandedHasChanged}
            allTables={allTables}
            levelSelections={levelSelections}
            handleItemClick={handleItemClick}
            expandedRowsInfo={expandedRowsInfo}
            isDevelopment={isDevelopment}
            columnWidths={columnWidths}
            minRowWidth={minRowWidth}
            setColumnWidths={setColumnWidths}
            updateResizeDetails={updateResizeDetails}
          />
        ))}
      {levelTable && isLevelSelectionDisabled(1, levelSelections) && (
        <button
          className={styles.custom_p}
          style={paddingAddBtn(0)}
          onClick={() => addRowItem(levelTable!, isDevelopment)}>
          + add {levelTable?.name.toLowerCase()}
        </button>
      )}
    </>
  );
};

export default PluginTL;
