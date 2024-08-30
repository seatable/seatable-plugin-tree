/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import deepCopy from 'deep-copy';
import ExpandableItem from './ExpandableItem';
import HeaderRow from './HeaderRow';
import { Table, TableColumn } from '../../utils/template-utils/interfaces/Table.interface';
import { PLUGIN_NAME } from '../../utils/template-utils/constants';
import { CellType } from 'dtable-utils';
import {
  generateUniqueRowId,
  getLevelSelectionAndTable,
  getRowsByTableId,
  getViewRows,
  isArraysEqual,
  isLevelSelectionDisabled,
  outputLevelsInfo,
  paddingAddBtn,
  updateExpandedState,
} from '../../utils/custom-utils/utils';
import {
  IPluginTLProps,
  RowExpandedInfo,
  levelRowInfo,
  levelsStructureInfo,
} from '../../utils/custom-utils/interfaces/CustomPlugin';
import styles from '../../styles/custom-styles/CustomPlugin.module.scss';
import { ResizeDetail } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';

const PluginTL: React.FC<IPluginTLProps> = ({
  allTables,
  columnsCount,
  hasLinkColumn,
  levelSelections,
  pluginDataStore,
  activePresetId,
  appActiveState,
  resetDataValue,
  isDevelopment,
  activePresetIdx,
  pluginPresets,
  updatePresets,
}) => {
  const [finalResult, setFinalResult] = useState<levelsStructureInfo>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [tableName, setTableName] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [columnWidths, setColumnWidths] = useState<ResizeDetail[]>(
    pluginPresets[activePresetIdx].settings?.resize_details || []
  );
  const [expandedRowsInfo, setExpandedRowsInfo] = useState<RowExpandedInfo[]>(
    pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows || []
  );
  const [expandedHasChanged, setExpandedHasChanged] = useState<boolean>(false);
  const [isSingleSelectColumn, setIsSingleSelectColumn] = useState<boolean>(false);
  const [rowsEmptyArray, setRowsEmptyArray] = useState<boolean>(false);
  const [minRowWidth, setMinRowWidth] = useState<number>(100);
  const [newItemName, setNewItemName] = useState<string>('');

  const collaborators = window.app.state.collaborators;
  const { levelTable } = getLevelSelectionAndTable(0, allTables, levelSelections);

  const firstLevelTable = useMemo(
    () => allTables.find((t) => t._id === levelSelections.first.selected?.value),
    [JSON.stringify(allTables), levelSelections.first.selected?.value]
  );

  const handleItemClick = (updatedRow: RowExpandedInfo): void => {
    const updatedRows = updateExpandedState(updatedRow, expandedRowsInfo);
    setExpandedRowsInfo(updatedRows);
    const presets = pluginDataStore.presets.map((preset) => {
      if (preset._id === activePresetId) {
        return {
          ...preset,
          expandedRows: updatedRows,
        };
      }
      return preset;
    });

    window.dtableSDK.updatePluginSettings(PLUGIN_NAME, {
      ...pluginDataStore,
      presets,
    });

    setExpandedHasChanged(!expandedHasChanged);
  };

  const updateResizeDetails = useCallback(
    (resize_details: ResizeDetail[]) => {
      const newPluginPresets = deepCopy(pluginPresets);
      const oldPreset = pluginPresets.find((p) => p._id === activePresetId)!;
      const _idx = pluginPresets.findIndex((p) => p._id === activePresetId);
      const settings = {
        ...oldPreset?.settings,
        resize_details,
      };
      const updatedPreset = { ...oldPreset, settings, _id: activePresetId };

      newPluginPresets.splice(_idx, 1, updatedPreset);
      pluginDataStore.presets = newPluginPresets;

      updatePresets(activePresetIdx, newPluginPresets, pluginDataStore, activePresetId);
    },
    [pluginPresets, activePresetId, pluginDataStore, updatePresets, activePresetIdx]
  );

  useEffect(() => {
    const newRowsExpandedInfo = pluginDataStore.presets.find(
      (preset) => preset._id === activePresetId
    )?.expandedRows;

    if (
      newRowsExpandedInfo !== undefined &&
      !isArraysEqual(newRowsExpandedInfo, expandedRowsInfo)
    ) {
      setExpandedRowsInfo(newRowsExpandedInfo);
    }
  }, [activePresetId, pluginDataStore.presets]);

  useEffect(() => {
    if (firstLevelTable && firstLevelTable.columns) {
      setColumns(firstLevelTable.columns);
      setTableName(firstLevelTable.name);
    }
  }, [firstLevelTable, columnsCount]);

  const firstRows = useMemo(() => {
    return getRowsByTableId(levelSelections.first.selected?.value, allTables);
  }, [JSON.stringify(allTables), levelSelections.first.selected?.value]);

  const memoizedOutputLevelsInfo = useMemo(() => {
    if (firstRows && firstLevelTable) {
      const firstTableId = levelSelections.first.selected?.value;
      return outputLevelsInfo(
        levelSelections,
        firstTableId,
        firstRows,
        expandedRowsInfo,
        levelSelections.second.selected?.value,
        allTables,
        levelSelections?.third?.selected?.value
      );
    }
    return null;
  }, [
    levelSelections,
    firstRows,
    expandedRowsInfo,
    JSON.stringify(allTables),
    levelSelections?.third?.selected?.value,
    firstLevelTable,
    resetDataValue,
  ]);

  useEffect(() => {
    const activeTableOne = allTables.find((t) => t._id === levelSelections.first.selected?.value);
    const viewTableOne =
      activeTableOne?.views.find((v) => v._id === appActiveState.activeTableView?._id) ||
      activeTableOne?.views[0];
    setHiddenColumns(viewTableOne?.hidden_columns ?? []);
    const activeViewRows = window.dtableSDK.getViewRows(viewTableOne, activeTableOne);

    if (memoizedOutputLevelsInfo) {
      setRowsEmptyArray(
        !memoizedOutputLevelsInfo?.cleanFinalResult?.some(
          (item) => item?.secondLevelRows && item.secondLevelRows.length > 0
        )
      );

      setFinalResult(getViewRows(memoizedOutputLevelsInfo.cleanFinalResult, activeViewRows || []));
      // Check if the new expanded rows are different from the current ones
      setExpandedRowsInfo((prevExpandedRowsInfo) => {
        const newExpandedRows = isArraysEqual(
          prevExpandedRowsInfo,
          memoizedOutputLevelsInfo.cleanExpandedRowsObj
        )
          ? prevExpandedRowsInfo
          : memoizedOutputLevelsInfo.cleanExpandedRowsObj;
        return prevExpandedRowsInfo !== newExpandedRows ? newExpandedRows : prevExpandedRowsInfo;
      });
    }
  }, [memoizedOutputLevelsInfo]);

  const calculateRowWidths = useCallback(() => {
    const rows = Array.from(document.querySelectorAll('.expandableItem'));
    return rows.map((row) => row.clientWidth);
  }, []);

  useEffect(() => {
    const rowWidths = calculateRowWidths();

    if (rowWidths.length === finalResult.length) {
      setMinRowWidth(100);
    } else {
      setMinRowWidth(Math.max(...rowWidths) || 100);
    }
  }, [finalResult, calculateRowWidths]);

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

    setIsAdding(true);
  };

  return (
    <>
      {hasLinkColumn && (
        <HeaderRow
          columns={columns}
          hiddenColumns={hiddenColumns}
          level={1}
          tableName={tableName}
          levelSelections={levelSelections}
          columnWidths={columnWidths}
          setColumnWidths={setColumnWidths}
          updateResizeDetails={updateResizeDetails}
        />
      )}
      {finalResult && hasLinkColumn ? (
        finalResult.map((i: levelRowInfo) => (
          <ExpandableItem
            key={i._id}
            item={i}
            level={1}
            rowsEmptyArray={rowsEmptyArray}
            expandedHasChanged={expandedHasChanged}
            allTables={allTables}
            hiddenColumns={hiddenColumns}
            levelSelections={levelSelections}
            handleItemClick={handleItemClick}
            expandedRowsInfo={expandedRowsInfo}
            isDevelopment={isDevelopment}
            columnWidths={columnWidths}
            columnsCount={columnsCount}
            minRowWidth={minRowWidth}
            setColumnWidths={setColumnWidths}
            updateResizeDetails={updateResizeDetails}
          />
        ))
      ) : (
        <p className={styles.centeredMessage}>There are no tables with links yet.</p>
      )}
      {isAdding && (
        <div className={styles.custom_expandableItem_rows}>
          <div
            className={`${styles.custom_expandableItem} expandableItem`}
            style={{
              width: '100%',
              paddingLeft: 24,
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
        <div className={styles.custom_expandableItem_rows}>
          <div
            className={`${styles.custom_expandableItem} expandableItem`}
            style={{
              width: '100%',
              paddingLeft: 24,
            }}>
            {firstColumn?.data.options?.map((op: any) => (
              <div key={op.id} className={styles.custom_single_select_row}>
                <input
                  onChange={() => {
                    setIsSingleSelectColumn(false);
                    addNewRowToTable(false, op.id);
                  }}
                  type="radio"
                  name=""
                  id={op.id}
                  value={op.id}
                />
                <label style={{ background: op.color, color: op.textColor }}>{op.name}</label>
              </div>
            ))}
          </div>
        </div>
      )}
      {levelTable && hasLinkColumn && isLevelSelectionDisabled(1, levelSelections) && (
        <button className={styles.custom_p} style={paddingAddBtn(0)} onClick={isShowNewRowInput}>
          + add {levelTable?.name.toLowerCase()}
        </button>
      )}
    </>
  );
};

export default PluginTL;
