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
  const [expandedHasChanged, setExpandedHasChanged] = useState<boolean>(false);

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

        if (
          isArraysEqual(
            expandedRowsInfo.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false })),
            r.cleanExpandedRowsObj.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false }))
          )
        )
          return;
        console.log('called');

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
    const updatedRows = updateExpandedState(updatedRow, expandedRowsInfo);

    console.log({ updatedRows });
    setExpandedRowsInfo(updatedRows);
    // console.log({ updatedExpandedRows });
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
