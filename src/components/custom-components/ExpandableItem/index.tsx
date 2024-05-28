import { levelRowInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';
import React, { useState } from 'react';

interface ExpandableItemProps {
  item: levelRowInfo;
  showName?: boolean; // Add a new prop to conditionally display the name
}

const ExpandableItem: React.FC<ExpandableItemProps> = ({ item, showName }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}>
        {item['0000']}
      </div>
      {isExpanded && (
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {item.nextLevelRows && item.nextLevelRows.length > 0 && (
              <p>{item.nextLevelRows[0]._name}</p>
            )}
            {item.nextLevelRows?.map((i: levelRowInfo) => <ExpandableItem key={i._id} item={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableItem;
