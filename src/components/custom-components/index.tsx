/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import ExpandableItem from './ExpandableItem';
import HeaderRow from './HeaderRow';
import { TableColumn } from '../../utils/template-utils/interfaces/Table.interface';
import { PLUGIN_NAME } from '../../utils/template-utils/constants';
import {
  addRowItem,
  getLevelSelectionAndTable,
  getRowsByTableId,
  isArraysEqual,
  outputLevelsInfo,
  updateExpandedState,
} from '../../utils/custom-utils/utils';
import {
  IPluginTLProps,
  RowExpandedInfo,
  levelRowInfo,
  levelsStructureInfo,
} from '../../utils/custom-utils/interfaces/CustomPlugin';

const PluginTL: React.FC<IPluginTLProps> = ({
  allTables,
  levelSelections,
  pluginDataStore,
  activePresetId,
  resetDataValue,
  isDevelopment
}) => {
  const [finalResult, setFinalResult] = useState<levelsStructureInfo>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [tableName, setTableName] = useState<string>('');
  const [expandedRowsInfo, setExpandedRowsInfo] = useState<RowExpandedInfo[]>(
    pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows || []
  );
  const [expandedHasChanged, setExpandedHasChanged] = useState<boolean>(false);
  const { levelTable } = getLevelSelectionAndTable(0, allTables, levelSelections);

  useEffect(() => {
    if (resetDataValue.t === 'TChanged') {
      console.log({ resetDataValue });
    }
  }, [resetDataValue]);

  useEffect(() => {
    const newRowsExpandedInfo = pluginDataStore.presets.find(
      (preset) => preset._id === activePresetId
    )?.expandedRows;
    if (newRowsExpandedInfo === undefined) return;
    setExpandedRowsInfo(newRowsExpandedInfo);
    setExpandedHasChanged(!expandedHasChanged);
  }, [activePresetId]);

  useEffect(() => {
    const firstLevelTable = allTables.find((t) => t._id === levelSelections.first.selected.value);
    if (firstLevelTable !== undefined && firstLevelTable.columns !== undefined) {
      setColumns(firstLevelTable.columns);
      setTableName(firstLevelTable.name);
    }
  }, []);

  useEffect(() => {
    const firstLevelTable = allTables.find((t) => t._id === levelSelections.first.selected.value);
    if (
      firstLevelTable !== undefined &&
      resetDataValue.t === 'TChanged' &&
      levelSelections !== undefined
    ) {
      setColumns(firstLevelTable.columns);
      setTableName(firstLevelTable.name);
    }

    const firstRows = getRowsByTableId(levelSelections.first.selected.value, allTables);
    if (firstRows !== undefined) {
      const firstTableId = levelSelections.first.selected.value;

      const r = outputLevelsInfo(
        firstTableId,
        firstRows,
        expandedRowsInfo,
        levelSelections.second.selected.value,
        allTables,
        levelSelections?.third?.selected.value
      );
      setFinalResult(r.finalResult);
      if (isArraysEqual(expandedRowsInfo, r.cleanExpandedRowsObj)) {
        setExpandedRowsInfo(
          pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows ||
            []
        );
        return;

        // setExpandedRowsInfo(r.cleanExpandedRowsObj);
      }
    }
  }, [JSON.stringify(allTables), levelSelections, resetDataValue]);

  const handleItemClick = (updatedRow: RowExpandedInfo): void => {
    const updatedRows = updateExpandedState(updatedRow, expandedRowsInfo);
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


  return (
    <>
      <HeaderRow columns={columns} tableName={tableName} />
      {finalResult &&
        finalResult.map((i: levelRowInfo) => (
          <ExpandableItem
            key={i._id}
            item={i}
            level={1}
            expandedHasChanged={expandedHasChanged}
            allTables={allTables}
            levelSelections={levelSelections}
            handleItemClick={handleItemClick}
            expandedRowsInfo={expandedRowsInfo}
            isDevelopment={isDevelopment}
          />
        ))}
      <button style={{ all: 'unset', cursor: 'pointer'}} onClick={() => addRowItem(levelTable!, isDevelopment)}>+ add {levelTable?.name}</button>
    </>
  );
};

export default PluginTL;
