import { ExpandableItemProps, levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { getTableById, getRowsByIds, getLinkCellValue } from 'dtable-utils';
import React, { useEffect, useState } from 'react';
import HeaderRow from '../HeaderRow';
import { Table, TableView } from '@/utils/template-utils/interfaces/Table.interface';
import { expandTheItem, getLevelSelectionAndTable } from '../../../utils/custom-utils/utils';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import pluginContext from '../../../plugin-context';
import EditorFormatter from '../../../components/template-components/Elements/formatter';

const ExpandableItem: React.FC<ExpandableItemProps> = ({
  item,
  level,
  allTables,
  levelSelections,
  handleItemClick,
  expandedRowsInfo,
  expandedHasChanged,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>();
  const { levelTable, levelRows } = getLevelSelectionAndTable(level, allTables, levelSelections);
  const rows = item[levelRows];
  console.log(levelTable?.columns);
  const isClickable = level !== 3 && rows?.length !== 0 && item[levelRows] !== undefined;
  console.log({ levelTable });

  const view = (): TableView | undefined => {
    if (levelTable && levelTable.views && levelTable.views.length > 0) {
      return levelTable.views[0];
    } else {
      return undefined;
    }
  };

  // Function to get the formula rows of the table
  const getTableFormulaRows = (table: Table, view: TableView) => {
    const rows = window.dtableSDK.getViewRows(view, table);
    return window.dtableSDK.getTableFormulaResults(table, rows);
  };

  // Function to get the link cell value
  const _getLinkCellValue = (linkId: string, table1Id: string, table2Id: string, rowId: string) => {
    const links = window.dtableSDK.getLinks();
    return getLinkCellValue(links, linkId, table1Id, table2Id, rowId);
  };

  // Function to get the rows by ID
  const getRowsByID = (tableId: string, rowIds: any) => {
    const table = _getTableById(tableId);
    return getRowsByIds(table, rowIds);
  };

  // Function to get the table by ID
  const _getTableById = (table_id: string) => {
    const tables = window.dtableSDK.getTables();
    return getTableById(tables, table_id);
  };

  // Function to get the user common info
  const getUserCommonInfo = (email: string, avatar_size: any) => {
    pluginContext.getUserCommonInfo(email, avatar_size);
  };

  // Function to get the media URL
  const getMediaUrl = () => {
    return pluginContext.getSetting('mediaUrl');
  };

  // Get the formula rows of the table
  const formulaRows = () => {
    if (levelTable) {
      return getTableFormulaRows(levelTable, view as unknown as TableView);
    }
  };

  // Get the collaborators
  const collaborators = window.app.state.collaborators;

  useEffect(() => {
    const t = expandTheItem(expandedRowsInfo, item._id);
    setIsExpanded(t);
  }, [expandedHasChanged, expandedRowsInfo]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        className={styles.custom_expandableItem}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
        onClick={
          isClickable
            ? () => {
                handleItemClick({ '0000': item['0000'], _id: item._id, expanded: !isExpanded });
              }
            : undefined
        }>
        <p>
          {'>'}
          {item['0000']}
        </p>
        <div className={styles.custom_formatter_cell} />
        {levelTable?.columns.map((column) => (
          <div key={column.key} className={styles.custom_formatter_cell}>
            <EditorFormatter
              column={column}
              row={item}
              table={levelTable}
              displayColumnName={false}
              getLinkCellValue={_getLinkCellValue}
              getTableById={_getTableById}
              getRowsByID={getRowsByID}
              selectedView={view}
              collaborators={collaborators}
              getUserCommonInfo={getUserCommonInfo}
              getMediaUrl={getMediaUrl}
              formulaRows={formulaRows}
            />
          </div>
        ))}
      </div>{' '}
      {isExpanded && (
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <HeaderRow columns={levelTable?.columns} tableName={levelTable?.name} />

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
              />
            ))}
            <p>+ add {levelTable?.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableItem;
