import { ILongTextProps } from '@/utils/template-utils/interfaces/Formatter/LongText.interface';
import React from 'react';

const SimpleLongTextFormatter: React.FC<ILongTextProps> = ({ value, containerClassName }) => {
  return (
    <div className={`${containerClassName}`}>
      <p>{value.preview}</p>
    </div>
  );
};

export default SimpleLongTextFormatter;
