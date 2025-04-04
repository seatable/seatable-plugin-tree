/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Calendar from 'rc-calendar';
import { ExpandableItemProps, levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { getTableById, getRowsByIds, getLinkCellValue, CellType } from 'dtable-utils';
import HeaderRow from '../HeaderRow';
import { Table, TableRow, TableView } from '@/utils/template-utils/interfaces/Table.interface';
import {
  expandTheItem,
  generateUniqueRowId,
  getLevelSelectionAndTable,
  isLevelSelectionDisabled,
  paddingAddBtn,
  sortRowsAlphabetically,
} from '../../../utils/custom-utils/utils';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import stylesFormatter from '../../../styles/template-styles/formatter/Formatter.module.scss';
import pluginContext from '../../../plugin-context';
import Formatter from '../../../components/template-components/Elements/Formatter';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import { Moment } from 'moment';
import SingleSelectEditor from '../../template-components/Elements/Formatter/Editors/SingleSelect/single-select-editor';

const ExpandableItem: React.FC<ExpandableItemProps> = ({
  item,
  level,
  allTables,
  columnsCount,
  hiddenColumns,
  levelSelections,
  handleItemClick,
  expandedRowsInfo,
  expandedHasChanged,
  rowsEmptyArray,
  isDevelopment,
  columnWidths,
  minRowWidth,
  setColumnWidths,
  updateResizeDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [isSingleSelectColumn, setIsSingleSelectColumn] = useState<boolean>(false);
  const [isDateColumn, setIsDateColumn] = useState<boolean>(false);
  const singleSelectRef = useRef<HTMLDivElement | null>(null);
  const { levelTable, levelRows, levelSelectionIdx } = getLevelSelectionAndTable(
    level,
    allTables,
    levelSelections
  );
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const rows = item[levelRows];
  const isClickable = level !== 3 && rows?.length !== 0 && item[levelRows] !== undefined;

  const handleClickOutside = (event: MouseEvent) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
      setIsDateColumn(false); // Update state when clicked outside
    }
    if (singleSelectRef.current && !singleSelectRef.current.contains(event.target as Node)) {
      setIsSingleSelectColumn(false); // Update state when clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  let currentTable = allTables.find((table) => table.name === item._name);
  currentTable =
    currentTable?.name === levelSelections.first.selected.label
      ? {
          ...currentTable,
          columns: currentTable?.columns.filter((col) => !hiddenColumns.includes(col.key)),
        }
      : currentTable;

  const viewObj = useMemo(() => {
    if (currentTable && currentTable.views && currentTable.views.length > 0) {
      return currentTable.views[0];
    }
    return undefined;
  }, [currentTable]);

  const getTableFormulaRows = useCallback((table: Table, view: TableView) => {
    const rows = window.dtableSDK.getViewRows(view, table);
    return window.dtableSDK.getTableFormulaResults(table, rows);
  }, []);

  const _getLinkCellValue = useCallback(
    (linkId: string, table1Id: string, table2Id: string, rowId: string) => {
      const links = window.dtableSDK.getLinks();
      return getLinkCellValue(links, linkId, table1Id, table2Id, rowId);
    },
    []
  );

  const _getTableById = useCallback((table_id: string) => {
    const tables = window.dtableSDK.getTables();
    return getTableById(tables, table_id);
  }, []);

  const getRowsByID = useCallback(
    (tableId: string, rowIds: string[]) => {
      const table = _getTableById(tableId);
      return getRowsByIds(table, rowIds);
    },
    [_getTableById]
  );

  const getUserCommonInfo = useCallback((email: string, avatar_size: number) => {
    pluginContext.getUserCommonInfo(email, avatar_size);
  }, []);

  const getMediaUrl = useCallback(() => {
    return pluginContext.getSetting('mediaUrl');
  }, []);

  const formulaRows = useMemo(() => {
    if (currentTable) {
      return getTableFormulaRows(currentTable, viewObj as TableView);
    }
    return undefined;
  }, [currentTable, viewObj, getTableFormulaRows]);

  const collaborators = window.app.state.collaborators;

  useEffect(() => {
    // Default to false if expandTheItem returns undefined
    const expandedState = expandTheItem(expandedRowsInfo, item.uniqueId) ?? false;
    setIsExpanded(expandedState);
  }, [expandedHasChanged, expandedRowsInfo, item.uniqueId]);

  const missingCollapseBtn = (isClickable: boolean) => {
    return !isClickable ? { cursor: 'default', paddingLeft: 24 } : undefined;
  };

  const levelStyleRows = (level: number) => {
    switch (level) {
      case 0:
        return undefined;
      case 1:
        return { paddingLeft: 10 };
      case 2:
        return { paddingLeft: 10 };
    }
  };
  const fontStyleRows = (level: number) => {
    const style = {
      width: `${
        columnWidths.find((width) => width.id === (firstColumn?.key || '0000') + currentTable?.name)
          ?.width || 200
      }px`,
    };
    switch (level) {
      case 0:
        return { ...style, fontSize: '18px' };
      case 1:
        return { ...style, fontSize: '15px' };
      case 2:
        return { ...style, fontSize: '15px', fontWeight: 'normal' };
    }
  };

  const minW = minRowWidth - 24 * --level;

  const onRowExpand = () => {
    if (isDevelopment) return;

    const row = currentTable?.rows.find((r: TableRow) => r._id === item._id);
    pluginContext.expandRow(row, currentTable);
  };

  const addNewRowToTable = (noValue?: boolean, givenValue?: string) => {
    setIsAdding(false);

    if (!newItemName && !noValue && !givenValue) {
      setNewItemName('');
      return;
    }

    const tableIndex = allTables.findIndex((t: Table) => t._id === levelTable?._id);
    const rowId = generateUniqueRowId();
    const newRow = {
      _participants: [],
      _creator: collaborators[0].email,
      _ctime: new Date().toISOString(),
      _last_modifier: collaborators[0].email,
      _mtime: new Date().toISOString(),
      _id: rowId,
      ...(noValue ? {} : { [levelTable?.columns[0].key!]: givenValue || newItemName }),
    };

    // create new row in appropriate table
    const lastRowId = levelTable?.rows[levelTable.rows.length - 1]._id;
    window.dtableSDK.dtableStore.insertRow(tableIndex, lastRowId, 'insert_below', newRow);

    // add link to newly created row
    let linkID = item[levelRows]?.[0]?.columns.find((c) => c.data.table_id === currentTable?._id)
      ?.data.link_id;

    if (!linkID) {
      linkID = item[levelRows]?.[0]?.columns.find(
        (c) => c.data.other_table_id === currentTable?._id
      )?.data.link_id;
    }

    window.dtableSDK.addLink(linkID, levelTable?._id, currentTable?._id, rowId, item._id);

    setNewItemName('');
  };

  const firstColumn = levelTable?.columns[0];

  const isShowNewRowInput = () => {
    if (firstColumn?.type === CellType.AUTO_NUMBER || firstColumn?.type === CellType.FORMULA) {
      addNewRowToTable(true);
      return;
    }

    if (firstColumn?.type === CellType.SINGLE_SELECT) {
      setIsSingleSelectColumn(true);
      return;
    }

    if (firstColumn?.type === CellType.DATE) {
      setIsDateColumn(true);
      return;
    }

    setIsAdding(true);
  };

  const dateOnChange = (date: Moment) => {
    if (!date) {
      setIsDateColumn(false);
      return;
    }

    addNewRowToTable(false, date.toDate().toISOString());
    setIsDateColumn(false);
  };

  return (
    <div className={styles.custom_expandableItem_rows} style={levelStyleRows(level)}>
      <div
        onClick={onRowExpand}
        className={`${styles.custom_expandableItem} expandableItem`}
        style={{
          minWidth: minRowWidth === 100 ? '100%' : `${minW}px`,
          ...missingCollapseBtn(isClickable),
        }}>
        {isClickable && (
          <button
            className={styles.custom_expandableItem_collapse_btn}
            onClick={
              isClickable
                ? (e) => {
                    e.stopPropagation();
                    handleItemClick({
                      '0000': item['0000'],
                      _id: item._id,
                      expanded: !isExpanded,
                      uniqueId: item.uniqueId,
                    });
                  }
                : undefined
            }>
            {isExpanded ? <SlArrowDown size={10} /> : <SlArrowRight size={10} />}
          </button>
        )}
        {
          <div className={styles.custom_expandableItem_name_col} style={fontStyleRows(level)}>
            <Formatter
              column={
                currentTable?.columns.find(
                  (c) => c.name.toLowerCase() === 'name' || c.key === firstColumn?.key
                )!
              }
              row={item}
              table={levelTable}
              displayColumnName={false}
              getLinkCellValue={_getLinkCellValue}
              getTableById={_getTableById}
              getRowsByID={getRowsByID}
              selectedView={viewObj}
              collaborators={collaborators}
              getUserCommonInfo={getUserCommonInfo}
              getMediaUrl={getMediaUrl}
              formulaRows={formulaRows}
            />
          </div>
        }
        {currentTable?.columns
          .filter((c) => c.name.toLowerCase() !== 'name' && c.key !== '0000')
          .map((column) => (
            <div
              key={column.key}
              style={{
                width: `${
                  columnWidths.find((width) => width.id === column.key + currentTable?.name)
                    ?.width || 200
                }px`,
              }}
              className={stylesFormatter.formatter_cell}>
              <Formatter
                column={column}
                row={item}
                table={levelTable}
                displayColumnName={false}
                getLinkCellValue={_getLinkCellValue}
                getTableById={_getTableById}
                getRowsByID={getRowsByID}
                selectedView={viewObj}
                collaborators={collaborators}
                getUserCommonInfo={getUserCommonInfo}
                getMediaUrl={getMediaUrl}
                formulaRows={formulaRows}
              />
            </div>
          ))}
        <div style={{ width: 90 }} />
      </div>
      {isExpanded && isClickable && (
        <div className={styles.custom_expandableItem_rows}>
          {!rowsEmptyArray && (
            <HeaderRow
              columns={levelTable?.columns}
              level={++level + 1}
              hiddenColumns={hiddenColumns}
              tableName={levelTable?.name}
              levelSelections={levelSelections}
              columnWidths={columnWidths}
              setColumnWidths={setColumnWidths}
              updateResizeDetails={updateResizeDetails}
            />
          )}
          {sortRowsAlphabetically(rows || [], levelSelections[levelSelectionIdx!]?.isSorted)?.map(
            (i: levelRowInfo) => (
              <ExpandableItem
                key={i._id}
                item={i}
                expandedRowsInfo={expandedRowsInfo}
                handleItemClick={handleItemClick}
                allTables={allTables}
                levelSelections={levelSelections}
                level={level + 1}
                expandedHasChanged={expandedHasChanged}
                rowsEmptyArray={rowsEmptyArray}
                isDevelopment={isDevelopment}
                columnWidths={columnWidths}
                columnsCount={columnsCount}
                hiddenColumns={hiddenColumns}
                minRowWidth={minRowWidth}
                setColumnWidths={setColumnWidths}
                updateResizeDetails={updateResizeDetails}
              />
            )
          )}
          {isAdding && (
            <div className={styles.custom_expandableItem_rows}>
              <div
                className={`${styles.custom_expandableItem} expandableItem`}
                style={{
                  width: '100%',
                  paddingLeft: 32,
                }}>
                <input
                  type={CellType.NUMBER === firstColumn?.type ? 'number' : 'text'}
                  className={styles.new_row_input}
                  autoFocus={isAdding}
                  onBlur={(e) => addNewRowToTable()}
                  value={newItemName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addNewRowToTable();
                    }
                  }}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
            </div>
          )}
          {isSingleSelectColumn && (
            <div ref={singleSelectRef} className={styles.custom_expandableItem_rows}>
              <div
                className={`${styles.custom_expandableItem} expandableItem`}
                style={{
                  width: '100%',
                  paddingLeft: 24,
                }}>
                <SingleSelectEditor
                  column={{
                    key: 'status',
                    data: firstColumn?.data,
                    type: CellType.SINGLE_SELECT,
                  }}
                  enableSearch={true}
                  key={firstColumn?.key}
                  newValues={firstColumn?.data}
                  isSupportNewOption={true}
                  onCommit={(value: { updatedValue: string }) => {
                    const selectedOption = firstColumn?.data?.options?.find(
                      (option: { name: string; color: string; textColor: string; id: string }) =>
                        option.id === value.updatedValue
                    );
                    if (selectedOption) {
                      const selectedOptionId = selectedOption.id;
                      addNewRowToTable(false, String(selectedOptionId));
                    }
                    setIsSingleSelectColumn(false);
                  }}
                />
              </div>
            </div>
          )}
          {isDateColumn && (
            <div ref={datePickerRef} className={styles.custom_expandableItem_rows}>
              <div
                className={`${styles.custom_expandableItem} expandableItem`}
                style={{
                  width: '100%',
                  paddingLeft: 24,
                }}>
                <Calendar onSelect={dateOnChange} dateInputPlaceholder="Enter date" showToday />
              </div>
            </div>
          )}
          {!rowsEmptyArray &&
            isLevelSelectionDisabled(level + 1, levelSelections) &&
            levelTable &&
            !isAdding &&
            !isSingleSelectColumn &&
            !isDateColumn && (
              <button
                className={styles.custom_p}
                style={paddingAddBtn(level)}
                onClick={isShowNewRowInput}>
                + Add row
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default ExpandableItem;
