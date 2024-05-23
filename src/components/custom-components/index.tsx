import { IPluginTLProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { TableRow } from '@/utils/template-utils/interfaces/Table.interface';
import React, { useState } from 'react';
import { getRowsByTableId, temporaryFunctionName } from '../../utils/custom-utils/utils';

const PluginTL: React.FC<IPluginTLProps> = ({ allTables, pluginDataStore, levelSelections }) => {
  let dataToDisplay: any[] = [];

  if (levelSelections !== undefined) {
    console.log(0);
    console.log({ levelSelections });
    const firstRows = getRowsByTableId(levelSelections.first.selected.value, allTables);

    if (firstRows !== undefined) {
      console.log(1);
      const firstTableId = levelSelections.first.selected.value;
      dataToDisplay = temporaryFunctionName(
        firstTableId,
        firstRows,
        allTables,
        levelSelections.second.selected.value,
        levelSelections?.third?.selected.value // Added nullish coalescing operator
      );
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {dataToDisplay && dataToDisplay.map((i: any) => <ExpandableItem item={i} />)}
    </div>
  );
};

export default PluginTL;

const ExpandableItem: React.FC<{ item: TableRow }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // console.log('item', item);

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
      {/* {isExpanded && (
        <div style={{ paddingLeft: '20px' }}>
          <div>
            <strong>Selected:</strong> {item['0000']}
          </div>
          <div>
            <strong>Options:</strong>
            <ul>
              {item.options.map((option) => (
                <li key={option.value}>{option.label}</li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};
