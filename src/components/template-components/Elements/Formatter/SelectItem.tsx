import {
  SelectItemProps,
  Option,
} from '@/utils/template-utils/interfaces/Formatter/SingleSelect.interface';
import React from 'react';

const SelectItem: React.FC<SelectItemProps> = ({ option }) => {
  const getStyle = (option: Option): React.CSSProperties => {
    return {
      display: 'inline-block',
      padding: '0px 10px',
      marginRight: '8px',
      height: '20px',
      lineHeight: '20px',
      textAlign: 'center',
      borderRadius: '10px',
      maxWidth: '250px',
      fontSize: '13px',
      backgroundColor: option.color,
      color: option.textColor || undefined,
    };
  };

  const style = getStyle(option);

  return (
    <div className="dtable-ui select-item text-truncate" style={style} title={option.name}>
      {option.name}
    </div>
  );
};

export default SelectItem;
