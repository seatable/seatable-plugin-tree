/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import deepCopy from 'deep-copy';
import Calendar from 'rc-calendar';
import ExpandableItem from './ExpandableItem';
import HeaderRow from './HeaderRow';
import { Table } from '../../utils/template-utils/interfaces/Table.interface';
import { PLUGIN_NAME } from '../../utils/template-utils/constants';
import { CellType } from 'dtable-utils';
import SingleSelectEditor from '../template-components/Elements/Formatter/Editors/SingleSelect/single-select-editor';
import {
  findSecondLevelTables,
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
import { Moment } from 'moment';

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
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [columnWidths, setColumnWidths] = useState<ResizeDetail[]>(
    pluginPresets[activePresetIdx].settings?.resize_details || []
  );
  const [expandedRowsInfo, setExpandedRowsInfo] = useState<RowExpandedInfo[]>(
    pluginDataStore.presets.find((preset) => preset._id === activePresetId)?.expandedRows || []
  );
  const [expandedHasChanged, setExpandedHasChanged] = useState<boolean>(false);
  const [isSingleSelectColumn, setIsSingleSelectColumn] = useState<boolean>(false);
  const [isDateColumn, setIsDateColumn] = useState<boolean>(false);
  const [rowsEmptyArray, setRowsEmptyArray] = useState<boolean>(false);
  const [minRowWidth, setMinRowWidth] = useState<number>(100);
  const [newItemName, setNewItemName] = useState<string>('');
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const singleSelectRef = useRef<HTMLDivElement | null>(null);

  const collaborators = window.app.state.collaborators;
  const { levelTable } = getLevelSelectionAndTable(0, allTables, levelSelections);

  const firstLevelTable = useMemo(() => {
    const table = allTables.find((t) => t._id === levelSelections.first.selected?.value);
    if (!table) {
      return allTables[0];
    }
    return table;
  }, [JSON.stringify(allTables), levelSelections.first.selected?.value]);

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

  const firstRows = useMemo(() => {
    let rows = getRowsByTableId(levelSelections.first.selected?.value, allTables);
    if (!rows || rows.length === 0) {
      rows = getRowsByTableId(allTables[0]._id, allTables);
    }

    return rows;
  }, [JSON.stringify(allTables), levelSelections.first.selected?.value]);

  const memoizedOutputLevelsInfo = useMemo(() => {
    if (firstRows && firstLevelTable) {
      const firstTableId = levelSelections.first.selected?.value || allTables[0]._id;

      // this fix is for the case when the plugin first loads and there's no levelSelections
      const defaultSecondLevel = findSecondLevelTables(allTables, {
        label: allTables[0].name,
        value: allTables[0]._id,
      });
      const defaultThirdLevel = findSecondLevelTables(allTables, {
        label: defaultSecondLevel[0]?.name,
        value: defaultSecondLevel[0]?._id,
      });

      return outputLevelsInfo(
        levelSelections,
        firstTableId,
        firstRows,
        expandedRowsInfo,
        levelSelections.second.selected?.value || defaultSecondLevel[0]?._id,
        allTables,
        levelSelections?.third?.selected?.value || defaultThirdLevel[0]?._id
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
    const _activeTableOne = allTables.find((t) => t._id === levelSelections.first.selected?.value);
    const activeTableOne = _activeTableOne || allTables[0];
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

      const _finalResult = getViewRows(memoizedOutputLevelsInfo.cleanFinalResult, activeViewRows);
      setFinalResult(_finalResult || []);
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
  }, [memoizedOutputLevelsInfo, hasLinkColumn]);

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

  const addNewRowToTable = async (noValue?: boolean, givenValue?: string) => {
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
    try {
      window.dtableSDK.dtableStore.insertRow(tableIndex, lastRowId, 'insert_below', newRow);
    } catch (error) {
      console.error('Error inserting new row:', error);
    } finally {
      setNewItemName('');
    }
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
    <>
      {hasLinkColumn && (
        <HeaderRow
          columns={levelTable?.columns}
          hiddenColumns={hiddenColumns}
          level={1}
          tableName={levelTable?.name}
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
        <div className={styles.centeredMessage}>
          <p>There are no tables with links yet.</p>
        </div>
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
      {levelTable &&
        !isAdding &&
        !isSingleSelectColumn &&
        !isDateColumn &&
        hasLinkColumn &&
        isLevelSelectionDisabled(1, levelSelections) && (
          <button className={styles.custom_p} style={paddingAddBtn(0)} onClick={isShowNewRowInput}>
            + Add row
          </button>
        )}
    </>
  );
};

export default PluginTL;
