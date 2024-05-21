import { IPluginTLProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { hasLinkColumn } from '../../../utils/custom-utils/utils';
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

  useEffect(() => {
    console.log(1);
    _allTables.map((t) => {
      const what = hasLinkColumn(allTables);
      console.log('what', what);
    });
  }, [_allTables]);

  return (
    <>
      <p>Plugin Tree List</p>
    </>
  );
};

export default PluginTL;
