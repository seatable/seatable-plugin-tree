import React, { useState } from 'react';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import { HeaderRowProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { isLevelSelectionDisabled } from '../../../utils/custom-utils/utils';
import ResizableCell from '../ResizableCell';
import { ResizeDetail } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';

const HeaderRow: React.FC<HeaderRowProps> = ({
  columns,
  hiddenColumns,
  level,
  tableName,
  levelSelections,
  columnWidths,
  setColumnWidths,
  updateResizeDetails,
}) => {
  const [onHover, setOnHover] = useState<boolean>(false);

  columns =
    tableName === levelSelections.first.selected.label
      ? columns?.filter((col) => !hiddenColumns.includes(col.key))
      : columns;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, col_id: string) => {
    const initialX = event.clientX;
    const prevWidth =
      columnWidths.find((width: ResizeDetail) => width.id === col_id + tableName)?.width || 200;
    const otherWidths = columnWidths.filter(
      (width: ResizeDetail) => width.id !== col_id + tableName
    );
    let widthChange = 0;

    const handleMouseMove = (event: MouseEvent) => {
      widthChange = event.clientX - initialX;

      setColumnWidths([...otherWidths, { id: col_id + tableName, width: prevWidth + widthChange }]);
    };

    const handleMouseUp = () => {
      updateResizeDetails([
        ...otherWidths,
        { id: col_id + tableName, width: prevWidth + widthChange },
      ]);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const levelStyleHeader = (level: number) => {
    switch (level) {
      case 1:
        return { paddingLeft: 24 };
      case 2:
        return { paddingLeft: 34, marginTop: 7 };
      case 3:
        return { paddingLeft: 34, marginTop: 7 };
    }
  };

  return (
    <div
      className={styles.custom_headerRow}
      style={levelStyleHeader(level)}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}>
      {columns &&
        isLevelSelectionDisabled(level, levelSelections) &&
        columns.map((column, index) => {
          const width =
            columnWidths.find((width: ResizeDetail) => width.id === column.key + tableName)
              ?.width || 200;
          return (
            <ResizableCell
              key={index}
              onHover={onHover}
              handleMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                handleMouseDown(e, column.key)
              }>
              <div style={{ width }} className={styles.custom_headerColumn}>
                {column?.name}
              </div>
            </ResizableCell>
          );
        })}
      <div>
        <div style={{ width: 100 }}></div>
      </div>
    </div>
  );
};

export default HeaderRow;
