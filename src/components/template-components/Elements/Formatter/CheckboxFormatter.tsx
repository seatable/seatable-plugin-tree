import React from 'react';
import { ICheckboxProps } from '@/utils/template-utils/interfaces/Formatter/Checkbox.interface';
import styles from '../../../../styles/template-styles/formatter/CheckBox.module.scss';

const CheckboxFormatter: React.FC<ICheckboxProps> = ({ value }) => {
  if (value) {
    return (
      <>
        <span className={`dtable-font dtable-icon-check-mark ${styles.checkboxMark}`}></span>
      </>
    );
  }
  return null;
};

export default CheckboxFormatter;
