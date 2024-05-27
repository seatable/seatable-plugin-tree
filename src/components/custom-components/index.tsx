import {
  IPluginTLProps,
  levelRowInfo,
  levelsStructureInfo,
} from '@/utils/custom-utils/interfaces/CustomPlugin';
import React from 'react';
import { getRowsByTableId, outputLevelsInfo } from '../../utils/custom-utils/utils';
import ExpandableItem from './ExpandableItem';
import HeaderRow from './HeaderRow';
import { TableColumn } from '@/utils/template-utils/interfaces/Table.interface';

const PluginTL: React.FC<IPluginTLProps> = ({ allTables, levelSelections }) => {
  let dataToDisplay: levelsStructureInfo = [];
  const firstLevelTable = allTables.find((t) => t._id === levelSelections.first.selected.value);
  let c: TableColumn[] = [];
  let n = '';
  if (firstLevelTable !== undefined) {
    c = firstLevelTable.columns;
    n = firstLevelTable.name;
  }

  if (levelSelections !== undefined) {
    const firstRows = getRowsByTableId(levelSelections.first.selected.value, allTables);

    if (firstRows !== undefined) {
      const firstTableId = levelSelections.first.selected.value;
      dataToDisplay = outputLevelsInfo(
        firstTableId,
        firstRows,
        levelSelections.second.selected.value,
        allTables,
        levelSelections?.third?.selected.value
      );
    }
  }
  console.log({ dataToDisplay });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <HeaderRow columns={c} tableName={n} />
      {dataToDisplay &&
        dataToDisplay.map((i: levelRowInfo) => (
          <ExpandableItem
            key={i._id}
            item={i}
            allTables={allTables}
            levelSelections={levelSelections}
            level={1}
          />
        ))}
    </div>
  );
};

export default PluginTL;
