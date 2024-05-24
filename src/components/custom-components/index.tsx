import { IPluginTLProps, levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import React, { useState } from 'react';
import { getRowsByTableId, outputLevelsInfo } from '../../utils/custom-utils/utils';

const PluginTL: React.FC<IPluginTLProps> = ({ allTables, levelSelections }) => {
  let dataToDisplay: any[] = [];

  if (levelSelections !== undefined) {
    const firstRows = getRowsByTableId(levelSelections.first.selected.value, allTables);

    if (firstRows !== undefined) {
      const firstTableId = levelSelections.first.selected.value;
      dataToDisplay = outputLevelsInfo(firstTableId, firstRows, allTables, levelSelections);
    }
  }
  console.log({ dataToDisplay });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {dataToDisplay &&
        dataToDisplay.map((i: levelRowInfo) => <ExpandableItem key={i._id} item={i} />)}
    </div>
  );
};

export default PluginTL;

const ExpandableItem: React.FC<{ item: levelRowInfo }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}>
        {item['0000']}
      </div>
      {isExpanded && (
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {item &&
              item.nextLevelRows?.map((i: levelRowInfo) => <ExpandableItem key={i._id} item={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};
