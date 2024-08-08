import React, { useState } from 'react';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import { HeaderRowProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { isLevelSelectionDisabled } from '../../../utils/custom-utils/utils';
import ResizableCell from '../ResizableCell';
import { ResizeDetail } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';

const HeaderRow: React.FC<HeaderRowProps> = ({
  columns,
  level,
  tableName,
  levelSelections,
  columnWidths,
  setColumnWidths,
  updateResizeDetails,
}) => {
  const [onHover, setOnHover] = useState<boolean>(false);
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    col_id: string,
    col_name: string
  ) => {
    const initialX = event.clientX;
    const columnName = col_name === 'Name' ? tableName : col_name;
    const prevWidth =
      columnWidths.find((width: ResizeDetail) => width.id === col_id + columnName)?.width || 200;
    const otherWidths = columnWidths.filter(
      (width: ResizeDetail) => width.id !== col_id + columnName
    );
    let widthChange = 0;

    const handleMouseMove = (event: MouseEvent) => {
      widthChange = event.clientX - initialX;

      setColumnWidths([
        ...otherWidths,
        { id: col_id + columnName, width: prevWidth + widthChange },
      ]);
    };

    const handleMouseUp = () => {
      updateResizeDetails([
        ...otherWidths,
        { id: col_id + columnName, width: prevWidth + widthChange },
      ]);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getColumnDisplayName = (columnName: string): string => {
    if (columnName === 'Name') {
      return capitalizeFirstLetter(tableName || '');
    }
    return capitalizeFirstLetter(columnName || '');
  };

  const levelStyleHeader = (level: number) => {
    switch (level) {
      case 1:
        return { paddingLeft: 24 };
      case 2:
        return { paddingLeft: 38 };
      case 3:
        return { paddingLeft: 38 };
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
          const columnName = column.name === 'Name' ? tableName : column.name;
          const width =
            columnWidths.find((width: ResizeDetail) => width.id === column.key + columnName)
              ?.width || 200;
          return (
            <ResizableCell
              key={index}
              onHover={onHover}
              handleMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                handleMouseDown(e, column.key, column.name)
              }>
              <div style={{ width }} className={styles.custom_headerColumn}>
                {getColumnDisplayName(column.name)}
              </div>
            </ResizableCell>
          );
        })}
    </div>
  );
};

export default HeaderRow;

function capitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
