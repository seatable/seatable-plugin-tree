import React, { useEffect, useState } from 'react';
import ExpandableItem from './ExpandableItem';
import HeaderRow from './HeaderRow';
import { TableColumn } from '../../utils/template-utils/interfaces/Table.interface';
import { PLUGIN_NAME } from '../../utils/template-utils/constants';
import {
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
}) => {
  const [finalResult, setFinalResult] = useState<levelsStructureInfo>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [tableName, setTableName] = useState<string>('');
  const [expandedRowsInfo, setExpandedRowsInfo] = useState<RowExpandedInfo[]>(
    pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows || []
  );
  const [expandedHasChanged, setExpandedHasChanged] = useState<boolean>(false);

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
    if (firstLevelTable !== undefined && resetDataValue.t === 'TChanged') {
      setColumns(firstLevelTable.columns);
      setTableName(firstLevelTable.name);
    }

    if (levelSelections !== undefined) {
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
        console.log(0);
        if (isArraysEqual(expandedRowsInfo, r.cleanExpandedRowsObj)) {
          setExpandedRowsInfo(
            pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows ||
              []
          );

          return;
        }

        setExpandedRowsInfo(r.cleanExpandedRowsObj);
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
          />
        ))}
    </div>
  );
};

export default PluginTL;
