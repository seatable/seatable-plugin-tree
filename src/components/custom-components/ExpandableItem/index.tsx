import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ExpandableItemProps, levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { getTableById, getRowsByIds, getLinkCellValue } from 'dtable-utils';
import HeaderRow from '../HeaderRow';
import { Table, TableView } from '@/utils/template-utils/interfaces/Table.interface';
import {
  addRowItem,
  expandTheItem,
  getLevelSelectionAndTable,
  isLevelSelectionDisabled,
  paddingAddBtn,
} from '../../../utils/custom-utils/utils';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import stylesFormatter from '../../../styles/template-styles/formatter/Formatter.module.scss';
import pluginContext from '../../../plugin-context';
import Formatter from '../../../components/template-components/Elements/Formatter';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';

const ExpandableItem: React.FC<ExpandableItemProps> = ({
  item,
  level,
  allTables,
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

  const { levelTable, levelRows } = getLevelSelectionAndTable(level, allTables, levelSelections);
  const rows = item[levelRows];
  const isClickable = level !== 3 && rows?.length !== 0 && item[levelRows] !== undefined;
  const currentTable = allTables.find((table) => table.name === item._name);

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
    if (levelTable) {
      return getTableFormulaRows(levelTable, viewObj as TableView);
    }
    return undefined;
  }, [levelTable, viewObj, getTableFormulaRows]);

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
    return level === 2 ? { paddingLeft: 24 } : undefined;
  };

  const minW = minRowWidth - 24 * --level;

  return (
    <div className={styles.custom_expandableItem_rows} style={levelStyleRows(level)}>
      <div
        className={`${styles.custom_expandableItem} expandableItem`}
        style={{
          minWidth: minW === 80 ? `${minW}vw` : `${minW}px`,
          ...missingCollapseBtn(isClickable),
        }}>
        {isClickable && (
          <button
            className={styles.custom_expandableItem_collapse_btn}
            onClick={
              isClickable
                ? () => {
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
        <p
          className={styles.custom_expandableItem_name_col}
          style={{
            width: `${
              columnWidths.find((width) => width.id === '0000' + currentTable?.name)?.width || 200
            }px`,
          }}>
          {item['0000']}
        </p>
        {currentTable?.columns
          .filter((c) => c.name.toLowerCase() !== 'name' && c.key !== '0000')
          .map((column) => (
            <div
              key={column.key}
              style={{
                width: `${
                  columnWidths.find((width) => width.id === column.key + column.name)?.width || 200
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
      </div>
      {isExpanded && (
        <div className={styles.custom_expandableItem_rows}>
          {!rowsEmptyArray && (
            <HeaderRow
              columns={levelTable?.columns}
              level={++level}
              tableName={levelTable?.name}
              levelSelections={levelSelections}
              columnWidths={columnWidths}
              setColumnWidths={setColumnWidths}
              updateResizeDetails={updateResizeDetails}
            />
          )}
          {rows?.map((i: levelRowInfo) => (
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
              minRowWidth={minRowWidth}
              setColumnWidths={setColumnWidths}
              updateResizeDetails={updateResizeDetails}
            />
          ))}
          {!rowsEmptyArray &&
            isLevelSelectionDisabled(level + 1, levelSelections) &&
            levelTable && (
              <button
                className={styles.custom_p}
                style={paddingAddBtn(level)}
                onClick={() => addRowItem(levelTable, isDevelopment)}>
                + add {levelTable?.name.toLowerCase()}
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default ExpandableItem;
