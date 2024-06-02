import React from 'react';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import { HeaderRowProps } from '@/utils/custom-utils/interfaces/CustomPlugin';

const HeaderRow: React.FC<HeaderRowProps> = ({ columns, tableName }) => {
  return (
    <div className={styles.custom_headerRow}>
      <div className={styles.custom_headerColumn}>{tableName}</div>
      {columns &&
        columns.map((column, index) => (
          <div key={index} className={styles.custom_headerColumn}>
            {/* the style is not looking good now but ATM the goal is to have the values */}
            {/* {column.name === 'Name' ? tableName : column.name} // not sure why this is done */}
            {column.name}
          </div>
        ))}
    </div>
  );
};

export default HeaderRow;
