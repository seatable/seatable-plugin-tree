import { ExpandableItemProps, levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import React, { useEffect, useState } from 'react';
import HeaderRow from '../HeaderRow';
import { expandTheItem, getLevelSelectionAndTable } from '../../../utils/custom-utils/utils';
import styles from '../../../styles/custom-styles/CustomPlugin.module.scss';

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
  const isClickable = level !== 3 && rows?.length !== 0 && item[levelRows] !== undefined;

  useEffect(() => {
    console.log({ item00: expandedRowsInfo[0].expanded });
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
                expandedRowsInfo={expandedRowsInfo}
                handleItemClick={handleItemClick}
                allTables={allTables}
                levelSelections={levelSelections}
                level={level + 1}
                expandedHasChanged={expandedHasChanged}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableItem;
