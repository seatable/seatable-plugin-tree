import React from 'react';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import { HeaderRowProps } from '@/utils/custom-utils/interfaces/CustomPlugin';
import { isLevelSelectionDisabled } from '../../../utils/custom-utils/utils';

const HeaderRow: React.FC<HeaderRowProps> = ({ columns, level, tableName, levelSelections }) => {
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
        return { paddingLeft: 48 };
      case 3:
        return { paddingLeft: 24 };
    }
  };

  return (
    <div className={styles.custom_headerRow} style={levelStyleHeader(level)}>
      {columns &&
        isLevelSelectionDisabled(level, levelSelections) &&
        columns.map((column, index) => (
          <div key={index} className={styles.custom_headerColumn}>
            {getColumnDisplayName(column.name)}
          </div>
        ))}
    </div>
  );
};

export default HeaderRow;

function capitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
