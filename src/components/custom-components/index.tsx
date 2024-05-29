import React, { useEffect, useState } from 'react';
import {
  getRowsByTableId,
  isArraysEqual,
  outputLevelsInfo,
  updateExpandedState,
} from '../../utils/custom-utils/utils';
import ExpandableItem from './ExpandableItem';
import HeaderRow from './HeaderRow';
import { TableColumn } from '../../utils/template-utils/interfaces/Table.interface';
import {
  IPluginTLProps,
  RowExpandedInfo,
  levelRowInfo,
  levelsStructureInfo,
} from '../../utils/custom-utils/interfaces/CustomPlugin';
import { PLUGIN_NAME } from '../../utils/template-utils/constants';

const PluginTL: React.FC<IPluginTLProps> = ({
  allTables,
  levelSelections,
  pluginDataStore,
  activePresetId,
}) => {
  const [finalResult, setFinalResult] = useState<levelsStructureInfo>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [tableName, setTableName] = useState<string>('');
  const [expandedRowsInfo, setExpandedRowsInfo] = useState<RowExpandedInfo[]>([]);

  let updatedExpandedRowsObj: RowExpandedInfo[] = [];

  useEffect(() => {
    const firstLevelTable = allTables.find((t) => t._id === levelSelections.first.selected.value);
    if (firstLevelTable !== undefined) {
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

        if (isArraysEqual(expandedRowsInfo, r.cleanExpandedRowsObj)) return;
        console.log('not equal');
        setExpandedRowsInfo(r.cleanExpandedRowsObj);
        updatedExpandedRowsObj = r.cleanExpandedRowsObj;
      }
    }
  }, [allTables, levelSelections]);

  // useEffect(() => {
  //   console.log(0, expandedRowsInfo);
  // }, [expandedRowsInfo]);

  const handleItemClick = (updatedRow: RowExpandedInfo): void => {
    console.log({ updatedRow }, 'plugindatastore updated');
    console.log({ expandedRowsInfo });

    updateExpandedState(updatedRow, expandedRowsInfo);
    setExpandedRowsInfo(expandedRowsInfo);
  };

  // console.log({ updatedExpandedRows });
  // window.dtableSDK.updatePluginSettings(PLUGIN_NAME, {
  //   ...pluginDataStore,
  //   presets: pluginDataStore.presets.map((preset) => {
  //     if (preset._id === activePresetId) {
  //       return {
  //         ...preset,
  //         expandedRows: updatedExpandedRows,
  //       };
  //     }
  //     return preset;
  //   }),
  // });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <HeaderRow columns={columns} tableName={tableName} />
      {finalResult &&
        finalResult.map((i: levelRowInfo) => (
          <ExpandableItem
            key={i._id}
            item={i}
            expanded={updatedExpandedRowsObj.find((e) => i._id === e.id)?.exp || false}
            expandedRowsInfo={expandedRowsInfo}
            handleItemClick={handleItemClick}
            allTables={allTables}
            levelSelections={levelSelections}
            level={1}
          />
        ))}
    </div>
  );
};

export default PluginTL;
