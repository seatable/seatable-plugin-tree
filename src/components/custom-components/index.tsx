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
}) => {
  const [finalResult, setFinalResult] = useState<levelsStructureInfo>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [tableName, setTableName] = useState<string>('');
  const [expandedRowsInfo, setExpandedRowsInfo] = useState<RowExpandedInfo[]>(
    pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows || []
  );
  const [expandedHasChanged, setExpandedHasChanged] = useState<boolean>(false);

  useEffect(() => {
    console.log({ activePresetId });
    const newRowsExpandedInfo = pluginDataStore.presets.find(
      (preset) => preset._id === activePresetId
    )?.expandedRows;
    if (newRowsExpandedInfo === undefined) return;
    console.log({ comp: newRowsExpandedInfo[0].expanded });
    // setExpandedRowsInfo(newRowsExpandedInfo);
    // setExpandedHasChanged(!expandedHasChanged);
    return;
  }, [activePresetId]);

  useEffect(() => {
    console.log(0);

    const firstLevelTable = allTables.find((t) => t._id === levelSelections.first.selected.value);
    if (firstLevelTable !== undefined) {
      setColumns(firstLevelTable.columns);
      setTableName(firstLevelTable.name);
    }

    if (levelSelections !== undefined) {
      const firstRows = getRowsByTableId(levelSelections.first.selected.value, allTables);
      if (firstRows !== undefined) {
        const firstTableId = levelSelections.first.selected.value;
        console.log({ useEff00: expandedRowsInfo[0].expanded });

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
        console.log({ useEff01: expandedRowsInfo[0].expanded });

        setExpandedRowsInfo(r.cleanExpandedRowsObj);
      }
    }
    console.log({ useEff02: expandedRowsInfo[0].expanded });
  }, [allTables, levelSelections]);

  const handleItemClick = (updatedRow: RowExpandedInfo): void => {
    console.log(1);
    console.log({ useEff10: expandedRowsInfo[0].expanded });

    const updatedRows = updateExpandedState(updatedRow, expandedRowsInfo);
    console.log({ useEff11: expandedRowsInfo[0].expanded });

    setExpandedRowsInfo(updatedRows);
    console.log({ useEff12: expandedRowsInfo[0].expanded });

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
    console.log({ useEff13: expandedRowsInfo[0].expanded });

    setExpandedHasChanged(!expandedHasChanged);
    console.log({ useEff14: expandedRowsInfo[0].expanded });
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
