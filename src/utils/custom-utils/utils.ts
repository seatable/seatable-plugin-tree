// MAKE HERE YOUR CUSTOM UTILS

import { TableArray } from '../template-utils/interfaces/Table.interface';
import { LINK_TYPE } from './constants';

export function customUtils() {
  console.log('custom utils');
}

export function hasLinkColumn(tables: TableArray): boolean {
  return tables.some((t) => t.columns.some((c) => c.type === LINK_TYPE.link));
}
