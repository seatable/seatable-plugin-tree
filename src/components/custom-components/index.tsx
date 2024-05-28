import {
  IPluginTLProps,
  levelRowInfo,
  levelsStructureInfo,
} from '@/utils/custom-utils/interfaces/CustomPlugin';
import React from 'react';
import { getRowsByTableId, outputLevelsInfo } from '../../utils/custom-utils/utils';
import ExpandableItem from './ExpandableItem';

const PluginTL: React.FC<IPluginTLProps> = ({ allTables, levelSelections }) => {
  let dataToDisplay: levelsStructureInfo = [];

  if (levelSelections !== undefined) {
    const firstRows = getRowsByTableId(levelSelections.first.selected.value, allTables);

    if (firstRows !== undefined) {
      const firstTableId = levelSelections.first.selected.value;
      dataToDisplay = outputLevelsInfo(firstTableId, firstRows, allTables, levelSelections);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {dataToDisplay && dataToDisplay.length > 0 && <p>{dataToDisplay[0]._name}</p>}
      {dataToDisplay &&
        dataToDisplay.map((i: levelRowInfo) => <ExpandableItem key={i._id} item={i} />)}
    </div>
  );
};

export default PluginTL;
