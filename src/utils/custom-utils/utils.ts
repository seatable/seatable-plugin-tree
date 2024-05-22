// MAKE HERE YOUR CUSTOM UTILS

import { TableArray } from '../template-utils/interfaces/Table.interface';
import { LINK_TYPE } from './constants';

export function findFirstLevelTables(tables: TableArray): TableArray {
  return tables.filter((table) => {
    return table.columns.some((column) => column.type === LINK_TYPE.link);
  });
}
