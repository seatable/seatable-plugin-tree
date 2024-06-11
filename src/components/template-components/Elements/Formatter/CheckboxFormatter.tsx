import { ICheckboxProps } from '@/utils/template-utils/interfaces/Formatter/Checkbox.interface';
import React from 'react';

const CheckboxFormatter: React.FC<ICheckboxProps> = ({ value }) => {
  if (value) {
    return (
      <div className="dtable-ui cell-formatter-container checkbox-formatter d-flex align-items-center justify-content-center">
        <span className="dtable-font dtable-icon-check-mark checkbox-checked-mark"></span>
      </div>
    );
  }
  return null;
};

export default CheckboxFormatter;
