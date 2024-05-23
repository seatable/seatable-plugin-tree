import { IPluginTLProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { TableArray } from '@/utils/template-utils/interfaces/Table.interface';
import React, { useEffect, useState } from 'react';
import ExpandableStructure from './Expandable';

// Plugin Tree List Component
const PluginTL: React.FC<IPluginTLProps> = ({
  appActiveState,
  allTables,
  pluginDataStore,
  levelSelections,
}) => {
  const [_allTables, setAllTables] = useState<TableArray>(allTables);

  useEffect(() => {
    if (levelSelections === undefined) {
      levelSelections = {
        first: {
          selected: { value: '', label: '' },
          rows: [],
          columns: [],
        },
        second: {
          selected: { value: '', label: '' },
          rows: [],
          columns: [],
        },
      };
    }
  }, []);

  return (
    <>
      <ExpandableStructure levelSelections={levelSelections} />
    </>
  );
};

export default PluginTL;
