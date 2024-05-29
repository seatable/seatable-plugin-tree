import { ILevelSelections, levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import React, { useState } from 'react';
import HeaderRow from '../HeaderRow';
import { TableArray } from '@/utils/template-utils/interfaces/Table.interface';
import { getLevelSelectionAndTable } from '../../../utils/custom-utils/utils';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
interface ExpandableItemProps {
  item: levelRowInfo;
  allTables: TableArray;
  levelSelections: ILevelSelections;
  level: number;
  handleItemClick: (item: any) => void;
}

const ExpandableItem: React.FC<ExpandableItemProps> = ({
  item,
  allTables,
  levelSelections,
  level,
  handleItemClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { levelTable, levelRows } = getLevelSelectionAndTable(level, allTables, levelSelections);
  const rows = item[levelRows];
  const isClickable = level !== 3 && rows?.length !== 0 && item[levelRows] !== undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        className={styles.custom_expandableItem}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
        onClick={
          isClickable
            ? () => {
                setIsExpanded(!isExpanded);
                handleItemClick(item['0000']);
              }
            : undefined
        }>
        {item['0000']}
      </div>{' '}
      {isExpanded && (
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <HeaderRow columns={levelTable?.columns} tableName={levelTable?.name} />
            {rows?.map((i: levelRowInfo) => (
              <ExpandableItem
                key={i._id}
                item={i}
                handleItemClick={handleItemClick}
                allTables={allTables}
                levelSelections={levelSelections}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableItem;
