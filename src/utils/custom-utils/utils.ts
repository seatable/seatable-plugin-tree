// MAKE HERE YOUR CUSTOM UTILS
import { PresetsArray } from '../template-utils/interfaces/PluginPresets/Presets.interface';
import { SelectOption } from '../template-utils/interfaces/PluginSettings.interface';
import {
  Table,
  TableArray,
  TableColumn,
  TableRow,
  TableView,
} from '../template-utils/interfaces/Table.interface';
import { LEVEL_DATA_DEFAULT, LINK_TYPE } from './constants';
import {
  ILevelSelections,
  LevelSelection,
  RowExpandedInfo,
  levelRowInfo,
  levelsStructureInfo,
} from './interfaces/CustomPlugin';
import pluginContext from '../../plugin-context';
import _ from 'lodash';

export function isLevelSelectionDisabled(level: number, levelSelections: ILevelSelections) {
  switch (level) {
    case 1:
      return !levelSelections.first.isDisabled;
    case 2:
      return !levelSelections.second.isDisabled;
    case 3:
      return !levelSelections.third?.isDisabled;
  }
}

export function levelSelectionDefaultFallback(
  pluginPresets: PresetsArray,
  activePresetId: string,
  allTables: TableArray
) {
  const dataStoreLevelSelections = pluginPresets.find(
    (p) => p._id === activePresetId
  )?.customSettings;

  // Check if dataStoreLevelSelections is undefined or its first.selected.value is empty
  if (
    dataStoreLevelSelections === undefined ||
    dataStoreLevelSelections.first.selected.value === ''
  ) {
    const fstLvlTbls = findFirstLevelTables(allTables);
    const selectedFstLvlObj =
      fstLvlTbls.length === 0
        ? LEVEL_DATA_DEFAULT
        : { value: fstLvlTbls[0]._id, label: fstLvlTbls[0].name };

    const scnLvlTbls = findSecondLevelTables(allTables, {
      value: fstLvlTbls[0]?._id || '',
      label: fstLvlTbls[0]?.name || '',
    });

    const selectedScnLvlObj =
      scnLvlTbls.length === 0
        ? LEVEL_DATA_DEFAULT
        : { value: scnLvlTbls[0]._id, label: scnLvlTbls[0].name };

    if (fstLvlTbls.length === 0 || scnLvlTbls.length === 0) {
      console.error(
        'It is possible that the first and second level tables have not been located. Please check the tables in the workspace.'
      );
    }

    return {
      first: { selected: selectedFstLvlObj, isDisabled: false },
      second: { selected: selectedScnLvlObj, isDisabled: false },
    } satisfies ILevelSelections;
  }

  // If dataStoreLevelSelections is valid, return it as is or with modifications if necessary
  return dataStoreLevelSelections;
}

export function findFirstLevelTables(tables: TableArray): TableArray {
  return tables.filter((table) => {
    return table.columns.some((column) => column.type === LINK_TYPE.link && table.rows.length > 0);
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
  return allTables.filter((t) => columnsWithLinkTypeIds.includes(t._id) && t.rows.length > 0);
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
  levelSelections: ILevelSelections,
  tableId: string,
  rows: TableRow[],
  expandedRowsInfo: RowExpandedInfo[],
  secondLevelId: string,
  allTables: TableArray,
  thirdLevelId?: string,
  keyName?: string
) => {
  const testDisablingLevels = {
    second: levelSelections.second.isDisabled,
    third: levelSelections.third ? levelSelections.third.isDisabled : true,
  };
  const table = allTables.find((t) => t._id === tableId);
  const linkedRows = window.dtableSDK.getTableLinkRows(rows, table);
  const allRowsInAllTables: TableRow[] = allTables.flatMap((t: Table) => t.rows);
  const linkedColumns = getLinkColumns(table?.columns || []);

  let secondLevelKey = linkedColumns.find((c) => c.data.other_table_id === secondLevelId)?.key;
  if (!secondLevelKey) {
    secondLevelKey = linkedColumns.find((c) => c.data.table_id === secondLevelId)?.key;
  }

  const finalResult: levelsStructureInfo = [];

  rows.forEach((r: TableRow) => {
    const _ids = linkedRows[r._id][secondLevelKey as string];
    let secondLevelRows = [];
    for (const i in _ids) {
      const linked_row = allRowsInAllTables.find((row: TableRow) => row._id === _ids[i]);
      if (linked_row) {
        secondLevelRows.push(linked_row);
      }
    }

    if (thirdLevelId || secondLevelId) {
      secondLevelRows = outputLevelsInfo(
        levelSelections,
        secondLevelId,
        secondLevelRows,
        expandedRowsInfo,
        thirdLevelId || '',
        allTables,
        undefined,
        'thirdLevelRows'
      ).cleanFinalResult;
    }

    finalResult.push({
      _name: table?.name || '',
      ...r,
      columns: linkedColumns,
      '0000': String(r['0000'] || ''),
      expanded: expandedRowsInfo.find((obj) => obj._id === r._id)?.expanded || false,
      uniqueId: '',
      [keyName ? keyName : 'secondLevelRows']: secondLevelRows,
    } satisfies levelRowInfo);
  });

  const cleanExpandedRowsObj = cleanObjects(finalResult, undefined, 1, undefined);
  let cleanFinalResult;
  if (testDisablingLevels.second || testDisablingLevels.third) {
    cleanFinalResult = isLevelDisabled(finalResult, testDisablingLevels);
  } else cleanFinalResult = finalResult;
  return { cleanFinalResult, cleanExpandedRowsObj };
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
  const firstLevel =
    JSON.stringify(a.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false }))) ===
    JSON.stringify(b.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false })));

  if (!firstLevel) return false;
  const secondLevel = a.every((r) => {
    const bRow = b.find((br) => br._id === r._id);
    if (!bRow) return false;
    return (
      JSON.stringify(
        r.secondLevelRows?.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false })) || []
      ) ===
      JSON.stringify(
        bRow.secondLevelRows?.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false })) || []
      )
    );
  });

  if (!secondLevel) return false;
  const thirdLevel = a.every((r) => {
    const bRow = b.find((br) => br._id === r._id);
    if (!bRow) return false;
    return (
      JSON.stringify(
        r.thirdLevelRows?.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false })) || []
      ) ===
      JSON.stringify(
        bRow.thirdLevelRows?.map((r) => ({ '0000': r['0000'], _id: r._id, expanded: false })) || []
      )
    );
  });

  return thirdLevel;
};

function cleanObjects(
  a: levelsStructureInfo,
  propertiesToKeep: string[] | undefined,
  level: number,
  parentId: string | undefined
) {
  const propertiesToKeeps =
    propertiesToKeep === undefined
      ? ['0000', '_id', 'expanded', 'secondLevelRows']
      : propertiesToKeep;
  const newCleanedExpandedRowsInfo = a.map((obj) => {
    const cleanObj: Partial<RowExpandedInfo> = {};
    propertiesToKeeps.forEach((prop: string) => {
      if (prop in obj) {
        cleanObj[prop as keyof RowExpandedInfo] = obj[prop as keyof levelRowInfo];
      }
    });
    parentId = (parentId || obj._id).slice(0, 4);
    const uniqueId = parentId + '_' + obj._id.slice(0, 4);
    cleanObj.uniqueId = uniqueId;
    obj.uniqueId = uniqueId;

    if (obj.secondLevelRows) {
      const propertiesToKeep = ['0000', '_id', 'expanded', 'thirdLevelRows'];
      cleanObj.secondLevelRows = cleanObjects(
        obj.secondLevelRows,
        propertiesToKeep,
        level + 1,
        obj._id
      );
    }
    if (obj.thirdLevelRows) {
      const propertiesToKeep = ['0000', '_id', 'expanded'];
      cleanObj.thirdLevelRows = cleanObjects(
        obj.thirdLevelRows,
        propertiesToKeep,
        level + 1,
        obj._id
      );
    }

    return cleanObj;
  });
  return newCleanedExpandedRowsInfo as RowExpandedInfo[];
}

function isLevelDisabled(
  finalResult: levelsStructureInfo,
  testDisablingLevels: { second: boolean; third: boolean }
) {
  const newResult = _.cloneDeep(finalResult);

  newResult.forEach((r) => {
    if (r.secondLevelRows) {
      r.secondLevelRows.forEach((row) => {
        if (row.thirdLevelRows && testDisablingLevels.third) {
          delete row.thirdLevelRows;
        }
      });
      if (testDisablingLevels.second) {
        delete r.secondLevelRows;
      }
    }
  });
  return newResult;
}

export const updateExpandedState = (
  updatedRow: RowExpandedInfo,
  rows: RowExpandedInfo[]
): RowExpandedInfo[] => {
  const targetId = updatedRow.uniqueId;
  const expandedValue = updatedRow.expanded;

  for (const row of rows) {
    if (row.uniqueId === targetId) {
      row.expanded = expandedValue;
      if (!expandedValue) {
        updateNestedExpanded(row, expandedValue);
      }
      break;
    }
    if (row.secondLevelRows) {
      row.secondLevelRows = updateExpandedState(updatedRow, row.secondLevelRows);
    }
    if (row.thirdLevelRows) {
      row.thirdLevelRows = updateExpandedState(updatedRow, row.thirdLevelRows);
    }
  }

  return rows;
};

const updateNestedExpanded = (row: RowExpandedInfo, expandedValue: boolean): void => {
  if (row.secondLevelRows) {
    for (const secondLevelRow of row.secondLevelRows) {
      secondLevelRow.expanded = expandedValue;
      if (secondLevelRow.thirdLevelRows) {
        updateNestedExpanded(secondLevelRow, expandedValue);
      }
    }
  }
};

export const expandTheItem = (
  expandedRowsInfo: RowExpandedInfo[],
  itemUniqueId: string,
  isFirstLevel = true
): boolean | undefined => {
  for (const row of expandedRowsInfo) {
    if (row.uniqueId === itemUniqueId) {
      return row.expanded;
    } else if (!row.expanded && isFirstLevel && row.secondLevelRows) {
      row.secondLevelRows.forEach((secondLevelRow: RowExpandedInfo) => {
        secondLevelRow.expanded = false;
        if (secondLevelRow.thirdLevelRows) {
          secondLevelRow.thirdLevelRows.forEach((thirdLevelRow: RowExpandedInfo) => {
            thirdLevelRow.expanded = false;
          });
        }
      });
    } else if (!row.expanded && !isFirstLevel && row.thirdLevelRows) {
      row.thirdLevelRows.forEach((thirdLevelRow: RowExpandedInfo) => {
        thirdLevelRow.expanded = false;
      });
    }
    if (row.secondLevelRows) {
      const result = expandTheItem(row.secondLevelRows, itemUniqueId, false);
      if (result !== undefined) return result;
    }
  }
  return undefined;
};

const getInsertedRowInitData = (view: TableView, table: Table, rowID: string) => {
  return window.dtableSDK.getInsertedRowInitData(view, table, rowID);
};

// functions for add row functionality
export const onAddRowItem = (
  view: TableView,
  table: Table,
  rowID: string,
  isDevelopment?: boolean
) => {
  if (isDevelopment) return;

  const rowData = getInsertedRowInitData(view, table, rowID);
  onInsertRow(table, view, rowData);
};

export const addRowItem = (table: Table, isDevelopment?: boolean) => {
  if (isDevelopment) {
    return;
  }

  let viewObj: TableView | undefined;
  const view = (): TableView | undefined => {
    if (table && table.views && table.views.length > 0) {
      viewObj = table.views[0];
      return viewObj;
    } else {
      viewObj = undefined;
      return viewObj;
    }
  };

  const rows = table?.rows;
  if (rows) {
    const row_id = rows.length > 0 ? rows[rows.length - 1]._id : '';
    const selectedView = view();
    if (selectedView) {
      onAddRowItem(selectedView, table, row_id);
    } else {
      console.error('No view available for adding row item.');
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onInsertRow = (table: Table, view: TableView, rowData: { [key: string]: any }) => {
  const columns = window.dtableSDK.getColumns(table);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newRowData: { [key: string]: any } = {};
  for (const key in rowData) {
    const column = columns.find((column: TableColumn) => column.name === key);
    if (!column) {
      continue;
    }
    switch (column.type) {
      case 'single-select': {
        newRowData[column.name] =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          column.data.options.find((item: any) => item.name === rowData[key])?.name || '';
        break;
      }
      case 'multiple-select': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const multipleSelectNameList: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowData[key].forEach((multiItemId: any) => {
          const multiSelectItemName = column.data.options.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (multiItem: any) => multiItem.id === multiItemId
          );
          if (multiSelectItemName) {
            multipleSelectNameList.push(multiSelectItemName.name);
          }
        });
        newRowData[column.name] = multipleSelectNameList;
        break;
      }
      default:
        newRowData[column.name] = rowData[key];
    }
  }

  const row_data = { ...newRowData };
  window.dtableSDK.appendRow(table, row_data, view);
  const viewRows = window.dtableSDK.getViewRows(view, table);
  const insertedRow = viewRows[viewRows.length - 1];
  if (insertedRow) {
    pluginContext.expandRow(insertedRow, table);
  }
};

export const paddingAddBtn = (level: number) => {
  if (level === 0 || level === 2) {
    return { paddingLeft: 34, paddingBottom: 20 };
  } else if (level === 1) {
    return { paddingLeft: 34, paddingBottom: 20 };
  }
};

export const generateUniqueRowId = (length = 22) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
