import { ExpandableItemProps, levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import React, { useEffect, useState } from 'react';
import HeaderRow from '../HeaderRow';
import { getLevelSelectionAndTable } from '../../../utils/custom-utils/utils';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';
import { BsXLg } from 'react-icons/bs';

const ExpandableItem: React.FC<ExpandableItemProps> = ({
  item,
  allTables,
  levelSelections,
  level,
  handleItemClick,
  expanded,
  expandedRowsInfo,
}) => {
  const [isExpanded, setIsExpanded] = useState(
    expandedRowsInfo.find((e) => item._id === e.i)?.e || false
  );
  const { levelTable, levelRows } = getLevelSelectionAndTable(level, allTables, levelSelections);
  const rows = item[levelRows];
  const isClickable = level !== 3 && rows?.length !== 0 && item[levelRows] !== undefined;

  useEffect(() => {
    const e = expandedRowsInfo.find((e) => item._id === e.i)?.e || false;
    setIsExpanded(e);
  }, [expandedRowsInfo]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        className={styles.custom_expandableItem}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
        onClick={
          isClickable
            ? () => {
                // setIsExpanded(!isExpanded);
                handleItemClick({ n: item['0000'], i: item._id, e: !isExpanded });
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
                expanded={isExpanded}
                expandedRowsInfo={expandedRowsInfo}
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
