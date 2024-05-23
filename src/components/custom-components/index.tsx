import { IPluginTLProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { TableRow } from '@/utils/template-utils/interfaces/Table.interface';
import React, { useState } from 'react';
import { getRowsByTableId, temporaryFunctionName } from '../../utils/custom-utils/utils';

const PluginTL: React.FC<IPluginTLProps> = ({ allTables, pluginDataStore, levelSelections }) => {
  console.log({ levelSelections });
  console.log({ pluginDataStore });
  if (levelSelections !== undefined) {
    const firstRows = getRowsByTableId(levelSelections.first.selected.value, allTables);
    if (firstRows !== undefined) {
      const firstTableId = levelSelections.first.selected.value;
      temporaryFunctionName(
        firstTableId,
        firstRows,
        levelSelections.second.selected.value,
        allTables
      );
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* {levelSelections && levelSelections.first.rows.map((i) => <ExpandableItem item={i} />)} */}
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
