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
}

const ExpandableItem: React.FC<ExpandableItemProps> = ({
  item,
  allTables,
  levelSelections,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { levelTable, levelRows } = getLevelSelectionAndTable(level, allTables, levelSelections);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        className={styles.custom_expandableItem}
        style={{ cursor: level !== 3 ? 'pointer' : 'default' }}
        onClick={level !== 3 ? () => setIsExpanded(!isExpanded) : undefined}>
        {item['0000']}
      </div>{' '}
      {isExpanded && (
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <HeaderRow columns={levelTable?.columns} tableName={levelTable?.name} />
            {item[levelRows]?.map((i: levelRowInfo) => (
              <ExpandableItem
                key={i._id}
                item={i}
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
