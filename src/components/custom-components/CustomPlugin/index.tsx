import { IPluginTLProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { TableArray } from '@/utils/template-utils/interfaces/Table.interface';
import React, { useEffect, useState } from 'react';

// Plugin Tree List Component
const PluginTL: React.FC<IPluginTLProps> = ({ appActiveState, allTables, pluginDataStore }) => {
  const [_allTables, setAllTables] = useState<TableArray>(allTables);

  useEffect(() => {
    console.log(0);
    // console.log('appActiveState', appActiveState);
    // console.log('allTables', allTables);
    // console.log('pluginDataStore', pluginDataStore);
  }, []);

  return (
    <>
      <p>Plugin Tree List</p>
    </>
  );
};

export default PluginTL;
