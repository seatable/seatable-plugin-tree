// MAKE HERE YOUR CUSTOM UTILS

import { PresetsArray } from '../template-utils/interfaces/PluginPresets/Presets.interface';
import { SelectOption } from '../template-utils/interfaces/PluginSettings.interface';
import {
  Table,
  TableArray,
  TableColumn,
  TableRow,
} from '../template-utils/interfaces/Table.interface';
import { LINK_TYPE } from './constants';
import {
  ILevelSelections,
  LevelSelection,
  RowExpandedInfo,
  levelRowInfo,
  levelsStructureInfo,
} from './interfaces/CustomPlugin';

export function levelSelectionDefaultFallback(
  pluginPresets: PresetsArray,
  activePresetId: string,
  allTables: TableArray
) {
  const dataStoreLevelSelections = pluginPresets.find((p) => p._id === activePresetId)
    ?.customSettings;

  // Check if dataStoreLevelSelections is undefined or its first.selected.value is empty
  if (
    dataStoreLevelSelections === undefined ||
    dataStoreLevelSelections.first.selected.value === ''
  ) {
    const { _id: fstId, name: fstName } = findFirstLevelTables(allTables)[0];
    const { _id: sndId, name: sndName } = findSecondLevelTables(allTables, {
      value: fstId,
      label: fstName,
    })[0];
    return {
      first: { selected: { value: fstId, label: fstName } },
      second: { selected: { value: sndId, label: sndName } },
    };
  }

  // If dataStoreLevelSelections is valid, return it as is or with modifications if necessary
  return dataStoreLevelSelections;
}

export function findFirstLevelTables(tables: TableArray): TableArray {
  return tables.filter((table) => {
    return table.columns.some((column) => column.type === LINK_TYPE.link);
  });
}
export function findSecondLevelTables(
  allTables: TableArray,
  firsLevelSelectedOption: SelectOption
): TableArray {
  // Finding the first level table
  const firstLevelTable = allTables.find((t) => t._id === firsLevelSelectedOption.value);

  // Finding the columns with link type
  const columnsWithLinkType = firstLevelTable?.columns.filter(
    (column: TableColumn) => column.type === LINK_TYPE.link
  );

  // Finding the second level tables ids
  const columnsWithLinkTypeIds: string[] = [];
  columnsWithLinkType?.filter((c) =>
    columnsWithLinkTypeIds.push(
      c.data.table_id !== firstLevelTable?._id ? c.data.table_id : c.data.other_table_id
    )
  );

  // Returning the second level tables
  return allTables.filter((t) => columnsWithLinkTypeIds.includes(t._id));
}

export function getRowsByTableId(tId: string, allTables: TableArray) {
  const table = allTables.find((t) => t._id === tId);
  return table?.rows;
}
export function getColumnsByTableId(tId: string, allTables: TableArray) {
  const table = allTables.find((t) => t._id === tId);
  return table?.columns;
}

const getLinkColumns = (columns: TableColumn[]) => {
  return columns.filter((column) => column.type === 'link');
};

// // linkCol is the selected column that links to another table e.g PROJECTS or MILESTONES
export const outputLevelsInfo = (
  tableId: string,
  rows: TableRow[],
  expandedRowsInfo: RowExpandedInfo[],
  secondLevelId: string,
  allTables: TableArray,
  thirdLevelId?: string,
  keyName?: string
) => {
  const table = allTables.find((t) => t._id === tableId);
  const linkedRows = window.dtableSDK.getTableLinkRows(rows, table);
  // console.log({ linkedRows });
  const allRowsInAllTables: TableRow[] = allTables.flatMap((t: Table) => t.rows);
  // console.log({ allRowsInAllTables });
  const linkedColumns = getLinkColumns(table?.columns || []);
  // console.log({ linkedColumns });
  let secondLevelKey = linkedColumns.find((c) => c.data.other_table_id === secondLevelId)?.key;
  // console.log({ secondLevelKey });
  if (secondLevelKey === undefined) {
    secondLevelKey = linkedColumns.find((c) => c.data.table_id === secondLevelId)?.key;
  }
  const finalResult: levelsStructureInfo = [];

  const expandedRowsObj: RowExpandedInfo[] = allRowsInAllTables.map((r) => ({
    n: r['0000'],
    i: r._id,
    e: false,
  }));

  rows.forEach((r: TableRow) => {
    const _ids = linkedRows[r._id][secondLevelKey as string];
    let secondLevelRows = [];
    for (const i in _ids) {
      const linked_row = allRowsInAllTables.find((r: TableRow) => r._id === _ids[i]);
      if (linked_row) {
        secondLevelRows.push(linked_row);
      }
    }

    if (thirdLevelId) {
      secondLevelRows = outputLevelsInfo(
        secondLevelId,
        secondLevelRows,
        expandedRowsInfo,
        thirdLevelId,
        allTables,
        undefined,
        'thirdLevelRows'
      ).finalResult;
    }

    finalResult.push({
      _name: table?.name || '',
      ...r,
      columns: linkedColumns,
      '0000': r['0000'].toString(),
      expanded: expandedRowsInfo.find((obj) => obj.i === r._id)?.e || false,
      // expanded: expandedRowsObj.find((obj) => obj.i === r._id)?.e || false,
      [keyName ? keyName : 'secondLevelRows']: secondLevelRows,
    } satisfies levelRowInfo);
  });

  const r = { finalResult, expandedRowsObj };

  return r;
};

export function getLevelSelectionAndTable(
  level: number,
  allTables: TableArray,
  levelSelections: ILevelSelections
) {
  let levelSelectionIdx: keyof ILevelSelections | undefined;
  type LevelRowKeys = 'nextLevelRows' | 'secondLevelRows' | 'thirdLevelRows';
  let levelRows: LevelRowKeys;

  switch (level) {
    case 0:
      levelSelectionIdx = 'first';
      levelRows = 'nextLevelRows';
      break;
    case 1:
      levelSelectionIdx = 'second';
      levelRows = 'secondLevelRows';
      break;
    case 2:
      levelSelectionIdx = 'third';
      levelRows = 'thirdLevelRows';
      break;
    default:
      levelRows = 'nextLevelRows';
      break;
  }

  let levelSelection: LevelSelection | undefined;
  if (levelSelectionIdx !== undefined) {
    levelSelection = levelSelections[levelSelectionIdx];
  }

  const levelTable = allTables.find((t) => t._id === levelSelection?.selected?.value);

  return { levelTable, levelRows };
}

export const isArraysEqual = (a: RowExpandedInfo[], b: RowExpandedInfo[]) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

